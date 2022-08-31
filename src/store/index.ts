import { defineStore } from 'pinia';
export interface RootState {
	nodeURL: string;
	backgroundImage: string | null;
	reposts: { [key: string]: string };
	recentlyJoined: boolean;
}

export const useRootStore = defineStore(`rootStore`, {
	state: (): RootState => {
		return {
			nodeURL: ``,
			backgroundImage: `@/assets/images/backgrounds/mainBG.webp`,
			reposts: {},
			recentlyJoined: true,
		};
	},
	actions: {
		setWelcome() {
			this.recentlyJoined = !this.recentlyJoined;
		},
	},
});
