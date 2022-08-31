import { defineStore } from 'pinia';
import { watch } from 'vue';
import { Profile } from '@/backend/profile';
// https://pinia.vuejs.org/core-concepts/

export interface Session {
	id: Profile[`id`];
	name: Profile[`name`];
	email: Profile[`email`];
	bio: Profile[`bio`];
	website: Profile[`website`];
	location: Profile[`location`];
	avatar: Profile[`avatar`];
	socials: Profile[`socials`];
	background: Profile[`background`];
	homeFeed: `TOP` | `NEW` | `FOLLOWING`;
	cid: string;
	subscriptionEnabled: boolean;
}

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
			cid: ``,
			bio: ``,
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
				bio: userData.bio,
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
		setCID(cid: string) {
			this.cid = cid;
		},
		setID(id: string) {
			this.id = id;
		},
		setName(name: string) {
			this.name = name;
		},
		setEmail(email: string) {
			this.email = email;
		},
		setWebsite(website: string) {
			this.website = website;
		},
		setAvatar(avatar: string) {
			this.avatar = avatar;
		},
		setBio(bio: string) {
			this.bio = bio;
		},
		setLocation(location: string) {
			this.location = location;
		},
	},
	getters: {},
});

export function createSessionFromProfile(cid: string, p: Profile): Session {
	return {
		cid,
		id: p.id,
		name: p.name,
		email: p.email,
		bio: p.bio,
		location: p.location,
		avatar: p.avatar,
		socials: [],
		website: p.website,
		background: p.background,
		homeFeed: p.id === `` ? `TOP` : `FOLLOWING`,
		subscriptionEnabled: true,
	};
}
