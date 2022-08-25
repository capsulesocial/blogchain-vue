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
export interface Tier {
	_id?: string;
	name: string;
	description?: string;
	details?: string;
	monthlyEnabled: boolean;
	monthlyPrice: number;
	yearlyEnabled: boolean;
	yearlyPrice: number;
}

export function getEmptyTier() {
	return {
		name: ``,
		monthlyEnabled: true,
		monthlyPrice: 10,
		yearlyEnabled: true,
		yearlyPrice: 100,
	};
}
