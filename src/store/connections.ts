import { defineStore } from 'pinia';
import { getFollowersAndFollowing } from '@/backend/following';

export interface Connections {
	followers: Set<string>;
	following: Set<string>;
}

export const useConnectionsStore = defineStore(`connections`, {
	state: (): Connections => {
		return {
			followers: new Set(),
			following: new Set(),
		};
	},
	persist: true,
	getters: {
		getFollowingList: (state: Connections) => {
			return state.following;
		},
		getFollowersList: (state: Connections) => {
			return state.followers;
		},
		isFollowing:
			(state: Connections) =>
			(id: string): boolean => {
				return state.following.has(id);
			},
		isFollowed: (state: Connections) => (id: string) => {
			return state.followers.has(id);
		},
	},
	actions: {
		async fetchConnections(me: string) {
			if (me) {
				return;
			}
			const { followers, following } = await getFollowersAndFollowing(me);
			this.followers = followers;
			this.following = following;
		},
	},
});
