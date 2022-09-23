import { defineStore } from 'pinia';
import { retrievePaymentProfile } from '@/backend/payment';
export interface SubscriptionTier {
	_id: string;
	username: string;
	name: string;
	monthlyEnabled: boolean;
	monthlyPrice: number;
	yearlyEnabled: boolean;
	yearlyPrice: number;
}
export interface PaymentProfile {
	username: string;
	paymentsEnabled: boolean;
	currency: string;
	stripeAccountId: string;
	tiers: SubscriptionTier[];
}
export interface PaymentProfileMap {
	paymentProfiles: {
		[key: string]: PaymentProfile;
	};
}

export const usePaymentsStore = defineStore(`payments`, {
	state: (): PaymentProfileMap => {
		return {
			paymentProfiles: {},
		};
	},
	actions: {
		async fetchPaymentProfile(id: string): Promise<PaymentProfile> {
			const paymentProfile = await retrievePaymentProfile(id);
			if (paymentProfile) {
				return paymentProfile;
			}
			return createDefaultPaymentProfile(id);
		},
	},
	getters: {
		getPaymentProfile: (state: PaymentProfileMap) => (id: string) => {
			return state.paymentProfiles[id];
		},
	},
});

export function createDefaultPaymentProfile(username: string): PaymentProfile {
	return {
		username,
		paymentsEnabled: false,
		currency: ``,
		stripeAccountId: ``,
		tiers: [],
	};
}
