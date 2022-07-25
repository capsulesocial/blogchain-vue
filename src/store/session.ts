import { defineStore } from 'pinia'
// https://pinia.vuejs.org/core-concepts/

function getLocalSession() {
	const ls = window.localStorage.getItem(`capsule-store-v2`)
	if (!ls) {
		return null
	}
	return JSON.parse(ls).session
}

export const useStore = defineStore(`session`, {
	state: () => {
		return {
			name: ``,
			id: ``,
			background: ``,
			avatar: ``,
		}
	},
	actions: {
		login() {
			const userData = getLocalSession()
			if (!userData) {
				return
			}
			this.$patch({
				name: userData.name,
				id: userData.id,
				background: userData.background,
				avatar: userData.avatar,
			})
		},
	},
	getters: {},
})
