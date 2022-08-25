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
import { defineStore } from 'pinia';
import { watch } from 'vue';
// https://pinia.vuejs.org/core-concepts/

function getLocalSession() {
	const ls = window.localStorage.getItem(`capsule-store-v2`);
	if (!ls) {
		return null;
	}
	return JSON.parse(ls).session;
}

export const useStore = defineStore(`session`, {
	state: () => {
		return {
			name: ``,
			id: ``,
			background: ``,
			avatar: ``,
			email: ``,
			location: ``,
			website: ``,
		};
	},
	persist: true,
	actions: {
		login() {
			const userData = getLocalSession();
			if (!userData) {
				return;
			}
			this.$patch({
				name: userData.name,
				id: userData.id,
				background: userData.background,
				avatar: userData.avatar,
				email: userData.email,
				location: userData.location,
				website: userData.website,
			});
			watch(
				this.$state,
				(state) => {
					// persist the whole state to the local storage whenever it changes
					localStorage.setItem('capsule-store-v2', JSON.stringify(state));
				},
				{ deep: true },
			);
		},
		setBackground(bg: string) {
			this.background = bg;
		},
	},
	getters: {},
});
