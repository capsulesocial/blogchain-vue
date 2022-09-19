import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
	getSubscriptionTransactions,
	cancelSubscription,
	ISubscriptionResponse,
	getUserSubscriptions,
	SubsTransaction,
} from '@/backend/subscription';
import { createDefaultProfile, getProfile } from '@/backend/profile';
import { switchSubscriptionTier } from '@/backend/payment';
import { SubscriptionTier } from '@/store/paymentProfile';
import { handleError } from '@/plugins/toast';
export interface ISubscriptionWithProfile extends ISubscriptionResponse {
	authorID: string;
	name: string;
	avatar: string;
	monthsSubbed: number;
}
export const useSubscriptionStore = defineStore(`subscriptions`, {
	state: () => {
		const active = ref<ISubscriptionWithProfile[]>([]);
		const inActive = ref<ISubscriptionWithProfile[]>([]);
		return {
			active,
			inActive,
		};
	},
	actions: {
		async fetchSubs(id: string): Promise<void> {
			if (!id) {
				return;
			}
			try {
				const subs = await getUserSubscriptions(id);
				const subsWithProfiles = [];
				for (const sub of subs) {
					const fetchedProfile = await getProfile(sub.authorID);
					const profile = fetchedProfile?.profile ?? createDefaultProfile(sub.authorID);
					const subWithProfile = {
						...sub,
						name: profile.name,
						avatar: profile.avatar,
						// TODO remove this when this value is provided by capsule-server
						monthsSubbed: 0,
					};
					subsWithProfiles.push(subWithProfile);
				}

				subsWithProfiles.forEach((subWithProfile) => {
					if (subWithProfile.isActive) {
						this.$state.active.push(subWithProfile);
						return;
					}
					this.$state.inActive.push(subWithProfile);
				});
			} catch (err) {
				handleError(`Error when fetching subscriptions`);
			}
		},
		async getSubsTransactions(id: string, subscriptionId: string): Promise<Array<SubsTransaction>> {
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
	},
	getters: {},
});
