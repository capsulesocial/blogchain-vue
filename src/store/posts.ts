import { defineStore } from 'pinia'

export const usePostsStore = defineStore(`posts`, {
	state: () => {
		return {
			postMap: {},
			offset: 0,
			sort: 'TOP',
			finished: false,
		}
	},
	getters: {},
	actions: {},
})
