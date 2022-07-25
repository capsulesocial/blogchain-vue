import { IStripeRefreshResponse, refreshStripeAccount } from '@/backend/payment'
import { handleError } from '@/plugins/toast'
import { defineStore } from 'pinia'
import { useStore } from './session'

export interface IStripeStatus {
	status: IStripeRefreshResponse
}

export const useStripeStatusStore = defineStore(`stripeStatus`, {
	state: (): IStripeStatus => {
		return {
			status: {
				isLoading: true,
				stripeConnected: false,
				paymentsEnabled: false,
				currency: 'usd',
			},
		}
	},
	getters: {
		stripeStatus(state: IStripeStatus) {
			return state.status
		},
	},
	actions: {
		async refreshStatus() {
			const username = useStore().$state.id
			try {
				this.status = await refreshStripeAccount(username)
			} catch (err) {
				this.status = {
					stripeConnected: false,
					paymentsEnabled: false,
				}
				handleError(err)
			}
			this.status.isLoading = false
		},
	},
	persist: true,
})
