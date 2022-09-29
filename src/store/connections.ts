import { defineStore } from 'pinia';
import { useStore } from '@/store/session';

import { getFollowersAndFollowing, followChange } from '@/backend/following';

import { toastSuccess, handleError } from '@/plugins/toast';

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
		async toggleFollowing(id: string): Promise<void> {
			const store = useStore();
			const isFollowing = await this.getFollowStatus(store.$state.id, id);

			if (id !== store.$state.id) {
				try {
					await followChange(isFollowing ? `UNFOLLOW` : `FOLLOW`, store.$state.id, id);
					toastSuccess(isFollowing ? `Unfollowed ${id}` : `Followed ${id}`);
					await this.fetchConnections(store.$state.id);
					console.log(await this.fetchConnections(store.$state.id));
				} catch (err: unknown) {
					handleError(err);
				}
			}
		},
	},
});
