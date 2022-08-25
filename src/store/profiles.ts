/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
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
		async fetchProfile(id: string) {
			const fetchedProfile = await getProfile(id);
			if (fetchedProfile.profile) {
				this.profileMap[id] = fetchedProfile.profile;
			}
		},
	},
});
