import { Algorithm, getPosts, IGenericPostResponse, readableTimeframe, Timeframe } from '@/backend/post';
import { handleError } from '@/plugins/toast';
import { defineStore } from 'pinia';
import { useStore } from './session';

export interface Posts {
	postMap: {
		[key: string]: IGenericPostResponse;
	};
	homeFeed: {
		algorithm: Algorithm;
		currentOffset: number;
		limit: number;
		noMorePosts: boolean;
		timeframe: Timeframe;
		isLoading: boolean;
	};
}

export const usePostsStore = defineStore(`posts`, {
	state: (): Posts => {
		return {
			postMap: {},
			homeFeed: {
				algorithm: Algorithm.NEW,
				currentOffset: 0,
				limit: 10,
				noMorePosts: false,
				isLoading: false,
				timeframe: Timeframe.MONTH,
			},
		};
	},
	persist: true,
	getters: {
		posts: (state: Posts) => {
			return Object.values(state.postMap);
		},
		displayTimeframe: (state: Posts) => {
			return readableTimeframe(state.homeFeed.timeframe);
		},
	},
	actions: {
		async fetchHomePosts(shouldReset = false) {
			if (this.homeFeed.isLoading) {
				return;
			}
			this.homeFeed.isLoading = true;
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
			try {
				const posts = await getPosts(timePayload, bookmarker, payload);
				// Emptying posts when algorithm is changed
				if (shouldReset) {
					this.emptyPosts();
				}
				for (const post of posts) {
					this.postMap[post.post._id] = post;
				}

				if (posts.length < this.homeFeed.limit) {
					this.homeFeed.noMorePosts = true;
				}
			} catch (error) {
				handleError(error);
			}
			this.homeFeed.currentOffset = Object.keys(this.postMap).length;
			this.homeFeed.isLoading = false;
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
			this.postMap = {};
		},
	},
});
