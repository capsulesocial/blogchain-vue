import { defineStore } from 'pinia';
export interface RootState {
	nodeURL: string;
	backgroundImage: string | null;
	reposts: Record<string, string>;
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
		setWelcome(dec: boolean) {
			this.recentlyJoined = dec;
		},
	},
});
