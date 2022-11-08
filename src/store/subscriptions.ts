import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	getSubscriptionTransactions,
	cancelSubscription,
	ISubscriptionResponse,
	getUserSubscriptions,
	SubsTransaction,
} from '@/backend/subscription';
import { switchSubscriptionTier } from '@/backend/payment';
import { SubscriptionTier } from '@/store/paymentProfile';
import { handleError } from '@/plugins/toast';
import { useProfilesStore } from '@/store/profiles';
import { useStore } from './session';
import { Stripe, loadStripe, PaymentMethod } from '@stripe/stripe-js';
import { confirmSubscriptionPayment, startSubscriptionPayment } from '@/backend/payment';
import { stripePublishableKey } from '@/backend/utilities/config';
export interface ISubscriptionWithProfile extends ISubscriptionResponse {
	authorID: string;
	name: string;
	avatar: string;
	monthsSubbed: number;
}

let _stripe: Stripe | null = null;

export const useSubscriptionStore = defineStore(`subscriptions`, {
	state: () => {
		const active = ref<ISubscriptionWithProfile[]>([]);
		const inActive = ref<ISubscriptionWithProfile[]>([]);
		return {
			active,
			inActive,
			selectedTier: {
				_id: ``,
				username: ``,
				name: ``,
				monthlyEnabled: true,
				monthlyPrice: 0,
				yearlyEnabled: false,
				yearlyPrice: 10,
			},
			selectedPeriod: `month`,
			saveEmail: true,
			cardErrorMessage: ``,
			isLoading: false,
			step: 0,
		};
	},
	getters: {
		getStep: (state): number => {
			return state.step;
		},
	},
	actions: {
		async fetchSubs(id: string) {
			if (!id) {
				return;
			}
			try {
				const subs = await getUserSubscriptions(id);
				const subsWithProfiles = [];
				for (const sub of subs) {
					const profile = useProfilesStore().getProfile(sub.authorID);
					const subWithProfile = {
						...sub,
						name: profile.name,
						avatar: profile.avatar,
						monthsSubbed: 0,
					};
					subsWithProfiles.push(subWithProfile);
				}

				subsWithProfiles.forEach((subWithProfile) => {
					// needs refactor
					if (!subWithProfile.isActive) {
						const checkInactive = this.$state.inActive.findIndex((inSub) => inSub.authorID === subWithProfile.authorID);
						if (checkInactive === -1) {
							this.$state.inActive.push(subWithProfile);
						}
					} else {
						const checkActive = this.$state.active.findIndex((aSub) => aSub.authorID === subWithProfile.authorID);
						if (checkActive === -1) {
							this.$state.active.push(subWithProfile);
						}
					}
				});
			} catch (err) {
				handleError(`Error when fetching subscriptions`);
			}
		},
		async getSubsTransactions(id: string, subscriptionId: string): Promise<SubsTransaction[]> {
			const transactions = await getSubscriptionTransactions(id, subscriptionId);
			return transactions;
		},
		async cancelSub(username: string, subid: string) {
			try {
				await cancelSubscription(username, subid);
				return true;
			} catch (err) {
				handleError(`Error when cancelling subscription`);
			}
		},
		async switchSubscriptionTier(
			username: string,
			subscriptionId: string,
			newTier: SubscriptionTier,
			period: string,
		): Promise<boolean> {
			const response = await switchSubscriptionTier(username, subscriptionId, newTier, period);
			return response;
		},
		nextStep() {
			this.step += 1;
		},
		previousStep() {
			this.step -= 1;
		},
		updateSelectedTier(tier: SubscriptionTier) {
			this.selectedTier = tier;
		},
		updateSelectedPeriod(period: string) {
			this.selectedPeriod = period;
		},
		updateEmail(toSave: boolean) {
			this.saveEmail = toSave;
		},
		updateCardMessage(message: string) {
			this.cardErrorMessage = message;
		},
		async submitPayment(paymentMethod: PaymentMethod, email: string): Promise<boolean> {
			if (!this.selectedTier) {
				throw new Error(`Tier not selected. Invalid state`);
			}
			this.isLoading = true;
			try {
				this.cardErrorMessage = ``;
				const { error, status, clientSecret, paymentAttemptId } = await startSubscriptionPayment(
					useStore().$state.id,
					this.selectedTier,
					this.selectedPeriod,
					paymentMethod.id,
					email,
					this.saveEmail,
				);
				if (error) {
					this.cardErrorMessage = error.message;
					this.isLoading = false;
					return false;
				}
				if (status === `requires_action`) {
					this.isLoading = true;
					const res = this.handleAuthenticatedPayment(paymentAttemptId, clientSecret);
					this.isLoading = false;
					return res;
				}
				if (status !== `succeeded`) {
					this.cardErrorMessage = `Payment is in invalid state`;
					this.isLoading = false;
					return false;
				}
				this.step = 4;
				return true;
			} catch (err: unknown) {
				if (err instanceof Error) {
					this.cardErrorMessage = err.message;
				}
				this.cardErrorMessage = `Unknown error`;
				return false;
			}
		},
		async handleAuthenticatedPayment(paymentAttemptId: string, clientSecret: string): Promise<boolean> {
			const stripe = await this.stripeClient();
			const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret);
			if (error) {
				this.cardErrorMessage = error.message ?? `Unknown error when confirming payment`;
				return false;
			}
			if (!paymentIntent?.id) {
				this.cardErrorMessage = `Invalid payment intent`;
				return false;
			}
			return this.confirmAuthenticatedPayment(paymentAttemptId, paymentIntent.id);
		},
		async confirmAuthenticatedPayment(paymentAttemptId: string, paymentIntentId: string): Promise<boolean> {
			try {
				this.cardErrorMessage = ``;
				const { error, status } = await confirmSubscriptionPayment(
					useStore().$state.id,
					paymentAttemptId,
					paymentIntentId,
				);
				if (error) {
					this.cardErrorMessage = error.message ?? `Subscription failed`;
					return false;
				}
				if (status !== `succeeded`) {
					this.cardErrorMessage = `This subscription payment failed with an unknown error`;
					return false;
				}
				this.step = 4;
				return true;
			} catch (err: unknown) {
				if (err instanceof Error) {
					this.cardErrorMessage = err.message;
				}
				this.cardErrorMessage = `Unknown error`;
				return false;
			}
		},
		async stripeClient(connectId?: string): Promise<Stripe> {
			// Either connectId should be passed or Stripe should already be initialized
			if (!connectId && !_stripe) {
				throw new Error(`Stripe not initialized`);
			}
			// Always create a new instance if connectId is passed.
			if (connectId) {
				_stripe = await loadStripe(stripePublishableKey, {
					stripeAccount: connectId,
					apiVersion: `2022-08-01`,
				});
			}
			// If stripe is still not initialized at this point, throw an error.
			if (!_stripe) {
				throw new Error(`Network error: Could not initiate stripe`);
			}
			return _stripe;
		},
		resetSelectedTier() {
			this.selectedTier = {
				_id: ``,
				username: ``,
				name: ``,
				monthlyEnabled: true,
				monthlyPrice: 0,
				yearlyEnabled: false,
				yearlyPrice: 10,
			};
		},
	},
});
