import { defineStore } from 'pinia';
// https://pinia.vuejs.org/core-concepts/

function getLocalSettings() {
	const ls = window.localStorage.getItem(`capsule-store-v2`);
	if (!ls) {
		return null;
	}
	return JSON.parse(ls).settings;
}

export const useStoreSettings = defineStore(`settings`, {
	state: () => {
		return {
			color: ``,
			mode: ``,
			darkMode: false,
			lastTopAlgorithm: `This month`,
			homeFeed: `NEW`,
			widgets: {
				primary: `feed`,
				secondary: `drafts`,
				secondary2: `tags`,
			},
			recentlyInSettings: false,
			recentlyPosted: false,
		};
	},
	persist: true,
	getters: {
		topAlgorithm(state) {
			return state.lastTopAlgorithm;
		},
		activeHomeFeed(state) {
			return state.homeFeed;
		},
		primaryWidget(state) {
			return state.widgets.primary;
		},
		secondaryWidget(state) {
			return state.widgets.secondary;
		},
		secondary2Widget(state) {
			return state.widgets.secondary2;
		},
		isDarkMode(state) {
			return state.darkMode;
		},
	},
	actions: {
		sync() {
			const settings = getLocalSettings();
			if (!settings) {
				return;
			}
			this.$patch({
				color: settings.color,
				mode: settings.mode,
				lastTopAlgorithm: `This month`,
			});
		},
		setMode(mode: `Light` | `Dark` | `OS`) {
			this.mode = mode;
		},
		setDarkMode(isDark: boolean) {
			this.darkMode = isDark;
		},
		setColor(c: `Green` | `Orange` | `Blue` | `Pink` | `Yellow`) {
			this.color = c;
		},
		setTopAlgorithm(alg: `Today` | `This week` | `This month` | `This year` | `All time`) {
			this.lastTopAlgorithm = alg;
		},
		setHomeFeed(alg: `NEW` | `TOP` | `FOLLOWING`) {
			this.homeFeed = alg;
		},
		setPrimaryWidget(w: `feed` | `editor`) {
			this.widgets.primary = w;
		},
		setSecondaryWidget(w: `drafts` | `bookmarks`) {
			this.widgets.secondary = w;
		},
		setSecondary2Widget(w: `tags` | `followers`) {
			this.widgets.secondary2 = w;
		},
		setRecentlyInSettings(isRecentlyInSettings: boolean) {
			this.recentlyInSettings = isRecentlyInSettings;
		},
		setRecentlyPosted(isRecentlyPosted: boolean) {
			this.recentlyPosted = isRecentlyPosted;
		},
	},
});
