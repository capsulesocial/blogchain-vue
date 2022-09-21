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
	getters: {},
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
