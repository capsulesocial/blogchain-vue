import { defineStore } from 'pinia';
import { getFollowersAndFollowing } from '@/backend/following';

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
	},
});
