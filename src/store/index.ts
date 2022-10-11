import { defineStore } from 'pinia';
export interface RootState {
	nodeURL: string;
	backgroundImage: string | null;
	reposts: Record<string, string>;
	recentlyJoined: boolean;
	showUnauthPopup: boolean;
}

export const useRootStore = defineStore(`rootStore`, {
	state: (): RootState => {
		return {
			nodeURL: ``,
			backgroundImage: `@/assets/images/backgrounds/mainBG.webp`,
			reposts: {},
			recentlyJoined: true,
			showUnauthPopup: false,
		};
	},
	actions: {
		setWelcome(dec: boolean) {
			this.recentlyJoined = dec;
		},
		toggleUnauthPopup(condition: boolean) {
			this.showUnauthPopup = condition;
		},
	},
});
