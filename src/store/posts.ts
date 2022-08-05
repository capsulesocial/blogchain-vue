import { Algorithm, getPosts, IGenericPostResponse, readableTimeframe, Timeframe } from '@/backend/post'
import { defineStore } from 'pinia'
import { useSessionStore } from './session'

export interface Posts {
	postMap: {
		[key: string]: IGenericPostResponse
	}
	newPosts: string[]
	topPosts: string[]
	homeFeed: {
		algorithm: Algorithm
		currentOffset: number
		limit: number
		noMorePosts: boolean
		timeframe: Timeframe
		isLoading: boolean
	}
}

export const usePostsStore = defineStore(`posts`, {
	state: (): Posts => {
		return {
			postMap: {},
			newPosts: [],
			topPosts: [],
			homeFeed: {
				algorithm: Algorithm.NEW,
				currentOffset: 0,
				limit: 10,
				noMorePosts: false,
				isLoading: false,
				timeframe: Timeframe.MONTH,
			},
		}
	},
	persist: true,
	getters: {
		newPosts: (state: Posts) => {
			return state.newPosts.map((cid) => state.postMap[cid])
		},
		topPosts: (state: Posts) => {
			return state.topPosts.map((cid) => state.postMap[cid])
		},
		posts: (state: Posts) => {
			return Object.values(state.postMap)
		},
		displayTimeframe: (state: Posts) => {
			return readableTimeframe(state.homeFeed.timeframe)
		},
	},
	actions: {
		async fetchHomePosts() {
			this.homeFeed.isLoading = true
			const id = useSessionStore().$state.id
			const timeframe = this.homeFeed.timeframe !== Timeframe.ALL_TIME ? this.homeFeed.timeframe : undefined
			const timePayload = this.homeFeed.algorithm === Algorithm.TOP ? { timeframe } : {}
			const payload = {
				sort: this.homeFeed.algorithm,
				limit: this.homeFeed.limit,
				offset: this.homeFeed.currentOffset,
				following: id,
			}
			const bookmarker = id !== `` ? id : `x`
			const posts = await getPosts(timePayload, bookmarker, payload)
			for (const post of posts) {
				this.postMap[post.post._id] = post
			}
			this.homeFeed.isLoading = false
		},
		async setAlgorithm(algorithm: Algorithm) {
			if (this.homeFeed.algorithm === algorithm) {
				return
			}
			this.homeFeed.algorithm = algorithm
			this.homeFeed.currentOffset = 0
			this.homeFeed.noMorePosts = false
			this.postMap = {}
			await this.fetchHomePosts()
		},
		async setTimeframe(timeframe: Timeframe) {
			if (this.homeFeed.timeframe === timeframe) {
				return
			}
			this.homeFeed.timeframe = timeframe
			this.homeFeed.currentOffset = 0
			this.homeFeed.noMorePosts = false
			this.postMap = {}
			await this.fetchHomePosts()
		},
	},
})
