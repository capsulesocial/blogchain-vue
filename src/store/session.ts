import { defineStore } from 'pinia'
import { watch } from 'vue'
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
	persist: true,
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
			watch(
				this.$state,
				(state) => {
					// persist the whole state to the local storage whenever it changes
					localStorage.setItem('capsule-store-v2', JSON.stringify(state))
				},
				{ deep: true },
			)
		},
		setBackground(bg: string) {
			this.background = bg
		},
	},
	getters: {},
})
