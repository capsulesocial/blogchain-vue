import { createDefaultProfile, getProfile, Profile } from '@/backend/profile';
import { defineStore } from 'pinia';

export interface Profiles {
	profileMap: {
		[key: string]: Profile;
	};
}

export const useProfilesStore = defineStore(`profiles`, {
	state: (): Profiles => {
		return {
			profileMap: {},
		};
	},
	persist: true,
	getters: {
		getProfile: (state: Profiles) => (id: string) => {
			if (state.profileMap[id]) {
				return state.profileMap[id];
			}

			return createDefaultProfile(id);
		},
	},
	actions: {
		async fetchProfilePostCount(id: string) {
			const fetchedProfile = await getProfile(id);
			if (fetchedProfile.totalPostsCount) {
				return fetchedProfile.totalPostsCount;
			}
			return 0;
		},
		async fetchProfile(id: string) {
			const fetchedProfile = await getProfile(id);
			if (fetchedProfile.profile) {
				this.profileMap[id] = fetchedProfile.profile;
			}
		},
	},
});
