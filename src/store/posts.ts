import { Algorithm, getPosts, IGenericPostResponse, readableTimeframe, Timeframe } from '@/backend/post';
import { defineStore } from 'pinia';
import { useStore } from './session';

export interface Posts {
	postMap: {
		[key: string]: IGenericPostResponse;
	};
	newPosts: string[];
	topPosts: string[];
	followingPosts: string[];
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
			newPosts: [],
			topPosts: [],
			followingPosts: [],
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
		newPostsList: (state: Posts) => {
			return state.newPosts.map((cid) => state.postMap[cid]);
		},
		topPostsList: (state: Posts) => {
			return state.topPosts.map((cid) => state.postMap[cid]);
		},
		displayTimeframe: (state: Posts) => {
			return readableTimeframe(state.homeFeed.timeframe);
		},
	},
	actions: {
		async fetchHomePosts(shouldReset = false) {
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
			const posts = await getPosts(timePayload, bookmarker, payload);
			if (shouldReset) {
				this.emptyPosts(this.homeFeed.algorithm);
			}
			for (const post of posts) {
				this.postMap[post.post._id] = post;
				this.addPost(this.homeFeed.algorithm, post);
			}
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
		addPost(algorithm: Algorithm, post: IGenericPostResponse) {
			switch (algorithm) {
				case Algorithm.NEW:
					this.newPosts.push(post.post._id);
					break;
				case Algorithm.TOP:
					this.topPosts.push(post.post._id);
					break;
				case Algorithm.FOLLOWING:
					this.followingPosts.push(post.post._id);
					break;
			}
		},
		emptyPosts(algorithm: Algorithm) {
			switch (algorithm) {
				case Algorithm.NEW:
					this.newPosts = [];
					break;
				case Algorithm.TOP:
					this.topPosts = [];
					break;
				case Algorithm.FOLLOWING:
					this.followingPosts = [];
					break;
			}
		},
	},
});
