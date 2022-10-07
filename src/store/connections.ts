import { defineStore } from 'pinia';
import { useStore } from '@/store/session';

import { getFollowersAndFollowing, followChange } from '@/backend/following';
import { IRepostResponse, Algorithm } from '@/backend/post';
import { getReposts, sendRepost } from '@/backend/reposts';

import { toastSuccess, handleError } from '@/plugins/toast';
import { sendPostDeletion } from '@/backend/postDeletion';

export interface Connections {
	profiles: Map<string, { followers: Set<string>; following: Set<string> }>;
}

export const useConnectionsStore = defineStore(`connections`, {
	state: (): Connections => {
		return {
			profiles: new Map<string, { followers: Set<string>; following: Set<string> }>(),
		};
	},
	persist: false,
	getters: {
		// Returns whether the logged in user is following account of id param
		getFollowStatus: (state: Connections) => (me: string, them: string) => {
			if (me === ``) {
				return false;
			}
			const myFollowing = state.profiles.get(me)?.following;
			return myFollowing?.has(them);
		},
		getConnections: (state: Connections) => (id: string) => {
			return state.profiles.get(id);
		},
		getMutualFollowers: (state: Connections) => (me: string, them: string) => {
			const myC = state.profiles.get(me);
			const theirC = state.profiles.get(them);
			if (!theirC || !myC) {
				return;
			}
			return new Set([...theirC.followers].filter((p) => myC.following.has(p)));
		},
	},
	actions: {
		async fetchConnections(id: string) {
			if (id === ``) {
				return;
			}
			// Fetch updated list
			const { followers, following } = await getFollowersAndFollowing(id);
			// Check if id is already in store
			this.$state.profiles.set(id, { followers, following });
			return this.$state.profiles.get(id);
		},
		async toggleFollowing(id: string) {
			const store = useStore();
			const isFollowing = this.getFollowStatus(store.$state.id, id);
			if (id !== store.$state.id) {
				try {
					await followChange(isFollowing ? `UNFOLLOW` : `FOLLOW`, store.$state.id, id);
					toastSuccess(isFollowing ? `Unfollowed ${id}` : `Followed ${id}`);
				} catch (err: unknown) {
					handleError(err);
				} finally {
					// Update local store with action
					if (isFollowing) {
						this.$state.profiles.get(store.id)?.following.delete(id);
						this.$state.profiles.get(id)?.followers.delete(store.id);
					} else {
						this.$state.profiles.get(store.id)?.following.add(id);
						this.$state.profiles.get(id)?.followers.add(store.id);
					}
				}
			}
		},
		async fetchReposts(
			id: string,
			sort: Algorithm,
			offset: number,
			limit: number,
		): Promise<IRepostResponse[] | undefined> {
			if (!id) {
				return;
			}
			return await getReposts({ authorID: id }, { sort: sort, offset: offset, limit: limit });
		},
		async sendSimpleRepost(authorID: string, postCID: string) {
			if (!authorID) {
				return;
			}
			try {
				const repostCID = await sendRepost(authorID, postCID, ``, `simple`);
				toastSuccess(`You have successfully reposted this post`);
				return repostCID;
			} catch (err: unknown) {
				handleError(err);
			}
		},
		async removeSimpleRepost(postCID: string, authorID: string) {
			try {
				await sendPostDeletion(`HIDE`, postCID, authorID);
				// soft delete the repost from the store
				toastSuccess(`This repost has been successfully removed`);
			} catch (err: unknown) {
				handleError(err);
			}
		},
		async sendQuoteRepost(authorID: string, postCID: string, content: string) {
			if (!authorID || !content) {
				return;
			}
			try {
				await sendRepost(authorID, postCID, content, `quote`);
			} catch (err: unknown) {
				handleError(err);
			}
		},
	},
});
