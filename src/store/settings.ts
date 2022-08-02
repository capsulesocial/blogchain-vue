import { defineStore } from 'pinia'
// https://pinia.vuejs.org/core-concepts/

function getLocalSettings() {
	const ls = window.localStorage.getItem(`capsule-store-v2`)
	if (!ls) {
		return null
	}
	return JSON.parse(ls).settings
}

export const useStoreSettings = defineStore(`settings`, {
	state: () => {
		return {
			color: ``,
			mode: ``,
			lastTopAlgorithm: `This month`,
			homeFeed: `NEW`,
		}
	},
	getters: {
		topAlgorithm(state) {
			return state.lastTopAlgorithm
		},
		activeHomeFeed(state) {
			return state.homeFeed
		},
	},
	actions: {
		sync() {
			const settings = getLocalSettings()
			if (!settings) {
				return
			}
			this.$patch({
				color: settings.color,
				mode: settings.mode,
				lastTopAlgorithm: `This month`,
			})
		},
		setTopAlgorithm(alg: `Today` | `This week` | `This month` | `This year` | `All time`) {
			this.lastTopAlgorithm = alg
		},
		setHomeFeed(alg: `NEW` | `TOP` | `FOLLOWING`) {
			this.homeFeed = alg
		},
	},
})
