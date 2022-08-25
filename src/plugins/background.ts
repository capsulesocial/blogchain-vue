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
import { backgrounds } from '../config/backgrounds';

export function getBGImage(id: string | undefined) {
	const darkMode: boolean = document.documentElement.classList[0] === `dark`;
	const bg = backgrounds.filter((background) => {
		return background.id === id;
	});
	if (bg.length < 1) {
		if (darkMode) {
			return backgrounds[0].dark;
		}
		return backgrounds[0].light;
	}
	if (darkMode) {
		return bg[0].dark;
	}
	return bg[0].light;
}
