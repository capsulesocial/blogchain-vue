import { Algorithm, getPosts, IGenericPostResponse, readableTimeframe, Timeframe } from '@/backend/post';
import { getBookmarksOfUser, sendBookmarkEvent } from '@/backend/bookmarks';
import { handleError } from '@/plugins/toast';
import { defineStore } from 'pinia';
import { useStore } from './session';

export interface Posts {
	posts: Map<string, IGenericPostResponse>;
	homeFeed: {
		algorithm: Algorithm;
		currentOffset: number;
		savedOffset: number;
		limit: number;
		noMorePosts: boolean;
		timeframe: Timeframe;
	};
	profilePosts: Map<string, string[]>;
	categoryPosts: Map<string, string[]>;
	bookmarkedPosts: Map<string, string[]>;
	tagPosts: Map<string, string[]>;
}

export const usePostsStore = defineStore(`posts`, {
	state: (): Posts => {
		return {
			posts: new Map<string, IGenericPostResponse>(),
			homeFeed: {
				algorithm: Algorithm.NEW,
				currentOffset: 0,
				savedOffset: 0,
				limit: 10,
				noMorePosts: false,
				timeframe: Timeframe.MONTH,
			},
			profilePosts: new Map<string, string[]>(),
			categoryPosts: new Map<string, string[]>(),
			bookmarkedPosts: new Map<string, string[]>(),
			tagPosts: new Map<string, string[]>(),
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
		getCategoryPosts: (state: Posts) => (category: string) => {
			return state.categoryPosts.get(category);
		},
		getBookmarkedPosts: (state: Posts) => () => {
			const id = useStore().$state.id;
			return state.bookmarkedPosts.get(id);
		},
		getPostsWithTag: (state: Posts) => (tag: string) => {
			return state.tagPosts.get(tag);
		},
	},
	actions: {
		async fetchTagPosts(tag: string, offset = 0) {
			if (tag === ``) {
				return [];
			}
			const id = useStore().$state.id;
			const bookmarker = id !== `` ? id : `x`;
			const payload = {
				limit: 10,
				offset,
				following: id,
			};
			// Send request
			try {
				const posts = await getPosts({ tag: tag }, bookmarker, payload);
				const postArr: string[] = [];
				// Add to store
				for (const post of posts) {
					this.$state.posts.set(post.post._id, post);
					postArr.push(post.post._id);
				}
				this.tagPosts.set(tag, postArr);
			} catch (err) {
				handleError(err);
				return [];
			}
		},
		async fetchBookmarkedPosts(offset = 0) {
			// Set up payload
			const id = useStore().$state.id;
			if (id === ``) {
				return;
			}
			// Send request
			try {
				const posts = await getBookmarksOfUser(id, undefined, `BOOKMARK_DESC`, 10, offset);
				const postArr: string[] = [];
				// Add to store
				for (const post of posts) {
					this.$state.posts.set(post.post._id, post);
					postArr.push(post.post._id);
				}
				this.bookmarkedPosts.set(id, postArr);
			} catch (err) {
				handleError(err);
				return [];
			}
		},
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
		async fetchDiscoverPosts(category: string, offset = 0) {
			if (category === ``) {
				return [];
			}
			const id = useStore().$state.id;
			const bookmarker = id !== `` ? id : `x`;
			const payload = {
				limit: 10,
				offset,
				following: id,
			};
			// Send request
			try {
				const posts = await getPosts({ category: category }, bookmarker, payload);
				const postArr: string[] = [];
				// Add to store
				for (const post of posts) {
					this.$state.posts.set(post.post._id, post);
					postArr.push(post.post._id);
				}
				this.categoryPosts.set(category, postArr);
			} catch (err) {
				handleError(err);
				return [];
			}
		},
		async fetchHomePosts(): Promise<IGenericPostResponse[]> {
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
				// Add to store
				for (const post of res) {
					this.$state.posts.set(post.post._id as string, post);
				}
				if (res.length < this.homeFeed.limit) {
					this.homeFeed.noMorePosts = true;
				}
				this.homeFeed.currentOffset = this.homeFeed.currentOffset + this.homeFeed.limit;
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
			await this.fetchHomePosts();
		},
		async setTimeframe(timeframe: Timeframe) {
			if (this.homeFeed.timeframe === timeframe) {
				return;
			}
			this.homeFeed.timeframe = timeframe;
			this.homeFeed.currentOffset = 0;
			this.homeFeed.noMorePosts = false;
			await this.fetchHomePosts();
		},
		async handleBookmark(bookmark: boolean, authorID: string, postCID: string) {
			const action: `ADD` | `REMOVE` = bookmark ? `ADD` : `REMOVE`;
			try {
				await sendBookmarkEvent(action, authorID, postCID);
			} catch (err) {
				throw new Error(err as string);
			} finally {
				this.fetchBookmarkedPosts(0);
			}
		},
	},
});
