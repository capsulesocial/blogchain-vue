import { defineStore } from 'pinia'

export const useStore = defineStore(`profile`, {
	state: () => {
		return {
			posts: ``,
		}
	},
	actions: {
		async getPosts() {},
	},
})
