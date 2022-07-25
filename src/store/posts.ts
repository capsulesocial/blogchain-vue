import { Algorithm, sendPostDeletion } from '@/backend/post'
import { IGenericPostResponse, getPosts } from '@/backend/post'
import { defineStore } from 'pinia'
import { useStore } from './session'
import { getBulkPosts, getLockedPostTiers, updatePostTier } from './../backend/content'
import { handleError } from '@/plugins/toast'

const PER_PAGE = 10

export interface Posts {
	postMap: {
		[key: string]: IGenericPostResponse
	}
	offset: number
	sort: Algorithm
	finished: boolean
	popularPostKey: string
}

export const usePostsStore = defineStore(`posts`, {
	state: (): Posts => {
		return {
			postMap: {},
			offset: 0,
			sort: 'TOP',
			finished: false,
			popularPostKey: '',
		}
	},
	getters: {
		posts: (state: Posts) => {
			return Object.values(state.postMap)
		},
		orderPost: (state: Posts) => {
			return state.sort
		},
		popularPost: (state: Posts) => {
			return state.postMap[state.popularPostKey]
		},
	},
	actions: {
		addPosts(posts: IGenericPostResponse[]) {
			for (const post of posts) {
				this.postMap[post.post._id] = post
			}
			this.offset = Object.keys(this.postMap).length
		},
		async fetchPopularPost() {
			const username = useStore().$state.id
			const encrypted = true
			const posts = await getPosts({ authorID: username, encrypted }, username, {
				limit: 1,
				sort: 'TOP',
			})
			if (posts && posts[0]) {
				const post = posts[0]
				this.postMap[post.post._id] = post
				this.updatePostsFromServer(username, [post.post._id])
				this.popularPostKey = post.post._id
			}
		},
		async loadMorePosts(sort: Algorithm = 'TOP', reset = false) {
			if (reset) {
				this.finished = false
			}

			if (this.finished) {
				return
			}

			try {
				const username = useStore().$state.id
				const posts = await getPosts(
					{
						authorID: username,
						encrypted: true,
					},
					username,
					{
						offset: reset ? 0 : this.offset,
						limit: PER_PAGE,
						sort,
					},
				)

				if (posts.length < PER_PAGE) {
					this.finished = true
				}

				if (reset) {
					this.postMap = {}
				}

				this.sort = sort
				this.addPosts(posts)
				// Start the update from server call asynchronously
				const cids = posts.map((p) => p.post._id)
				this.updatePostsFromServer(username, cids)
			} catch (err) {
				handleError(err)
			}
		},
		async updatePostsFromServer(username: string, cids: string[]) {
			if (cids.length < 1) {
				return
			}

			try {
				const serverPosts = await getBulkPosts(username, cids)
				for (const serverPost of serverPosts) {
					this.postMap[serverPost.cid].post.enabledTiers = serverPost.enabledTiers
					this.postMap[serverPost.cid].viewsCount = serverPost.viewsCount
				}
			} catch (err) {
				handleError(err)
			}
		},
		async updateTiersForPost(cid: string, enabledTiers: string[]) {
			const username = useStore().$state.id
			await updatePostTier(username, cid, enabledTiers)
			this.fetchTiersForPost(cid)
		},
		async fetchTiersForPost(cid: string) {
			const tiers = await getLockedPostTiers(cid)
			const post = this.postMap[cid]
			if (!post) {
				return
			}
			post.post.enabledTiers = tiers
		},
		async deletePost(cid: string) {
			const username = useStore().$state.id
			await sendPostDeletion(cid, username)
			delete this.postMap[cid]
		},
	},
})
