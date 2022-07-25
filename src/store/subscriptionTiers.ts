import { createTierBackend, deleteTierBackend, retrieveSubscriptionTiers, updateTierBackend } from '@/backend/payment'
import { Tier } from '@/interfaces/Tier'
import { defineStore } from 'pinia'
import { useStore } from './session'

export interface Tiers {
	tierList: Tier[]
}

export const useTiersStore = defineStore(`subscriptionTiers`, {
	state: (): Tiers => {
		return {
			tierList: [],
		}
	},
	getters: {
		tiers: (state: Tiers) => {
			return state.tierList
		},
	},
	actions: {
		setTiers(tiers: Tier[]) {
			this.tierList = tiers
		},
		async fetchTiers() {
			const username = useStore().$state.id
			const tiers = await retrieveSubscriptionTiers(username)
			this.setTiers(tiers)
		},
		async updateOrCreateTier(tier: Tier) {
			const username = useStore().$state.id
			if (tier._id) {
				await updateTierBackend(username, tier._id, tier)
			} else {
				await createTierBackend(username, tier)
			}
			this.fetchTiers()
		},
		async deleteTier(tier: Tier) {
			const username = useStore().$state.id
			await deleteTierBackend(username, tier)
			this.fetchTiers()
		},
	},
})
