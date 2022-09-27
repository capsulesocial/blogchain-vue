import { Algorithm, getPosts, IGenericPostResponse, readableTimeframe, Timeframe } from '@/backend/post';
import { handleError } from '@/plugins/toast';
import { defineStore } from 'pinia';
import { useStore } from './session';

export interface Posts {
	posts: Map<string, IGenericPostResponse>;
	homeFeed: {
		algorithm: Algorithm;
		currentOffset: number;
		limit: number;
		noMorePosts: boolean;
		timeframe: Timeframe;
		isLoading: boolean;
	};
	profilePosts: Map<string, string[]>;
}

export const usePostsStore = defineStore(`posts`, {
	state: (): Posts => {
		return {
			posts: new Map<string, IGenericPostResponse>(),
			homeFeed: {
				algorithm: Algorithm.NEW,
				currentOffset: 0,
				limit: 10,
				noMorePosts: false,
				isLoading: false,
				timeframe: Timeframe.MONTH,
			},
			profilePosts: new Map<string, string[]>(),
		};
	},
	getters: {
		getPosts: (state: Posts) => {
			return state.posts;
		},
		displayTimeframe: (state: Posts) => {
			return readableTimeframe(state.homeFeed.timeframe);
		},
		getPost: (state: Posts) => (cid: string) => {
			return state.posts.get(cid);
		},
		getProfilePosts: (state: Posts) => (authorID: string) => {
			return state.profilePosts.get(authorID);
		},
	},
	actions: {
		async fetchProfilePosts(authorID: string, offset = 0) {
			// Set up payload
			const id = useStore().$state.id;
			if (authorID === ``) {
				return;
			}
			const bookmarker = id !== `` ? id : `x`;
			const payload = {
				limit: 10,
				offset,
				following: id,
			};
			// Send request
			try {
				const posts = await getPosts({ authorID }, bookmarker, payload);
				const postArr: string[] = [];
				// Add to store
				for (const post of posts) {
					this.$state.posts.set(post.post._id, post);
					postArr.push(post.post._id);
				}
				this.profilePosts.set(authorID, postArr);
			} catch (err) {
				handleError(err);
				return [];
			}
		},
		async fetchHomePosts(shouldReset = false): Promise<IGenericPostResponse[]> {
			if (this.homeFeed.isLoading) {
				return [];
			}
			this.homeFeed.isLoading = true;
			// Set up payload
			const id = useStore().$state.id;
			const timeframe = this.homeFeed.timeframe !== Timeframe.ALL_TIME ? this.homeFeed.timeframe : undefined;
			const timePayload = this.homeFeed.algorithm === Algorithm.TOP ? { timeframe } : {};
			const payload = {
				sort: this.homeFeed.algorithm,
				limit: this.homeFeed.limit,
				offset: this.homeFeed.currentOffset,
				following: id,
			};
			const bookmarker = id !== `` ? id : `x`;
			// Send request
			try {
				const res = await getPosts(timePayload, bookmarker, payload);
				// Emptying posts when algorithm is changed
				if (shouldReset) {
					this.emptyPosts();
				}
				// Add to store
				for (const post of res) {
					this.$state.posts.set(post.post._id as string, post);
				}
				if (res.length < this.homeFeed.limit) {
					this.homeFeed.noMorePosts = true;
				}
				this.homeFeed.currentOffset = this.$state.posts.size;
				this.homeFeed.isLoading = false;
				return res;
			} catch (error) {
				handleError(error);
				return [];
			}
		},
		async setAlgorithm(algorithm: Algorithm) {
			if (this.homeFeed.algorithm === algorithm) {
				return;
			}
			this.homeFeed.algorithm = algorithm;
			this.homeFeed.currentOffset = 0;
			this.homeFeed.noMorePosts = false;
			await this.fetchHomePosts(true);
		},
		async setTimeframe(timeframe: Timeframe) {
			if (this.homeFeed.timeframe === timeframe) {
				return;
			}
			this.homeFeed.timeframe = timeframe;
			this.homeFeed.currentOffset = 0;
			this.homeFeed.noMorePosts = false;
			await this.fetchHomePosts(true);
		},
		emptyPosts() {
			this.$state.posts = new Map();
		},
	},
});
