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
			widgets: {
				primary: `feed`,
				secondary: `drafts`,
				secondary2: `tags`,
			},
		}
	},
	persist: true,
	getters: {
		topAlgorithm(state) {
			return state.lastTopAlgorithm
		},
		activeHomeFeed(state) {
			return state.homeFeed
		},
		primaryWidget(state) {
			return state.widgets.primary
		},
		secondaryWidget(state) {
			return state.widgets.secondary
		},
		secondary2Widget(state) {
			return state.widgets.secondary2
		},
		darkMode(state) {
			if (state.mode === `Dark`) {
				return true
			}
			return false
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
		setPrimaryWidget(w: `feed` | `editor`) {
			this.widgets.primary = w
		},
		setSecondaryWidget(w: `drafts` | `bookmarks`) {
			console.log(`setting secondary widget `, w)
			this.widgets.secondary = w
		},
		setSecondary2Widget(w: `tags` | `followers`) {
			this.widgets.secondary2 = w
		},
	},
})
