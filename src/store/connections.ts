import { defineStore } from 'pinia';
import { getFollowersAndFollowing } from '@/backend/following';

export interface Connections {
	followers: string[];
	following: string[];
}

export const useConnectionsStore = defineStore(`connections`, {
	state: (): Connections => {
		return {
			followers: [],
			following: [],
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
				return state.following.indexOf(id) !== -1;
			},
		isFollowed: (state: Connections) => (id: string) => {
			return state.followers.indexOf(id) !== -1;
		},
	},
	actions: {
		async fetchConnections(me: string) {
			if (me) {
				return;
			}
			const { followers, following } = await getFollowersAndFollowing(me);
			this.followers = [...followers];
			this.following = [...following];
		},
	},
});
