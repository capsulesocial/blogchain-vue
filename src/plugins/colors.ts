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
import { reactive } from 'vue';
import { useStore } from '../store/session';
import { useStoreSettings } from '../store/settings';

export const darkMode = reactive({
	dark: false,
});

export function initColors() {
	const store = useStore();
	const settings = useStoreSettings();

	// add event listeners
	const darkEventListener = (e: MediaQueryListEvent) => {
		if (e.matches && settings.mode === `OS`) {
			document.documentElement.classList.add(`dark`);
		}
	};

	const lightEventListener = (e: MediaQueryListEvent) => {
		if (e.matches && settings.mode === `OS`) {
			document.documentElement.classList.remove(`dark`);
		}
	};

	window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`, darkEventListener);
	window.matchMedia(`(prefers-color-scheme: light)`).addEventListener(`change`, lightEventListener);

	// console.log(window.matchMedia(`(prefers-color-scheme: dark)`).matches)

	if (!store.id) {
		store.login();
	}
	if (!settings.color || !settings.mode) {
		settings.sync();
	}
	switch (settings.mode) {
		case `Dark`:
			settings.setDarkMode(true);
			document.documentElement.classList.add(`dark`);
			break;
		case `Light`:
			settings.setDarkMode(false);
			document.documentElement.classList.remove(`dark`);
			break;
		case `OS`:
			if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
				settings.setDarkMode(true);
				document.documentElement.classList.add(`dark`);
			} else if (window.matchMedia(`(prefers-color-scheme: light)`).matches) {
				settings.setDarkMode(false);
				document.documentElement.classList.remove(`dark`);
			}
			break;
		default:
			settings.setDarkMode(false);
			document.documentElement.classList.remove(`dark`);
			break;
	}

	switch (settings.color) {
		case `Green`:
			document.documentElement.classList.add(`green`);
			document.documentElement.classList.remove(`orange`);
			document.documentElement.classList.remove(`blue`);
			document.documentElement.classList.remove(`pink`);
			document.documentElement.classList.remove(`yellow`);
			// state.hex = `#7097ac`
			break;
		case `Orange`:
			document.documentElement.classList.add(`orange`);
			document.documentElement.classList.remove(`green`);
			document.documentElement.classList.remove(`blue`);
			document.documentElement.classList.remove(`pink`);
			document.documentElement.classList.remove(`yellow`);
			// state.hex = `#ff4747`
			break;
		case `Blue`:
			document.documentElement.classList.add(`blue`);
			document.documentElement.classList.remove(`orange`);
			document.documentElement.classList.remove(`green`);
			document.documentElement.classList.remove(`pink`);
			document.documentElement.classList.remove(`yellow`);
			// state.hex = `#396bf8`
			break;
		case `Pink`:
			document.documentElement.classList.add(`pink`);
			document.documentElement.classList.remove(`orange`);
			document.documentElement.classList.remove(`blue`);
			document.documentElement.classList.remove(`green`);
			document.documentElement.classList.remove(`yellow`);
			// state.hex = `#eb3d7c`
			break;
		case `Yellow`:
			document.documentElement.classList.add(`yellow`);
			document.documentElement.classList.remove(`orange`);
			document.documentElement.classList.remove(`blue`);
			document.documentElement.classList.remove(`green`);
			document.documentElement.classList.remove(`pink`);
			// state.hex = `#ffcc33`
			break;
		default:
			document.documentElement.classList.add(`green`);
			document.documentElement.classList.remove(`orange`);
			document.documentElement.classList.remove(`blue`);
			document.documentElement.classList.remove(`pink`);
			document.documentElement.classList.remove(`yellow`);
			// state.hex = `#7097ac`
			break;
	}
}
