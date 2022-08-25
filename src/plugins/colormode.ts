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
export function setColorMode(newMode = `OS`) {
	switch (newMode) {
		case `Dark`:
			document.documentElement.classList.add(`dark`);
			break;
		case `Light`:
			document.documentElement.classList.remove(`dark`);
			break;
		case `OS`:
			if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
				document.documentElement.classList.add(`dark`);
			} else if (window.matchMedia(`(prefers-color-scheme: light)`).matches) {
				document.documentElement.classList.remove(`dark`);
			}
			break;
		default:
			document.documentElement.classList.remove(`dark`);
			break;
	}
}
