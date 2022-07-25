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
		}
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
			})
		},
	},
})
