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
import Toastify from 'toastify-js';

import SuccessAvatar from '../assets/images/util/success.png';
import WarningAvatar from '../assets/images/util/warning.png';
import ErrorAvatar from '../assets/images/util/error.png';
import MesageAvatar from '../assets/images/util/message.png';
import { AxiosError } from 'axios';

export function toastSuccess(text: string): void {
	Toastify({
		text,
		duration: 4000,
		gravity: `bottom`, // `top` or `bottom`
		position: `left`,
		avatar: SuccessAvatar,
		style: {
			background: `#E9F2F7`,
			border: `1px solid`,
			borderColor: `#1F7DAD`,
			borderRadius: `0.5rem`,
			fontSize: `0.875rem`,
			color: `#1F7DAD`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.8rem`,
			paddingBottom: `0.9rem`,
			position: `fixed`,
			right: `7.4%`,
			marginBottom: `1%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast();
}

export function toastWarning(text: string): void {
	Toastify({
		text,
		duration: 4000,
		gravity: `bottom`, // `top` or `bottom`
		position: `left`,
		avatar: WarningAvatar,
		style: {
			background: `#FEF8F3`,
			border: `1px solid`,
			borderColor: `#F0B785`,
			borderRadius: `0.5rem`,
			color: `#F0B785`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.8rem`,
			paddingBottom: `0.9rem`,
			position: `fixed`,
			right: `7.4%`,
			marginBottom: `1%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast();
}

export function toastError(text: string): void {
	Toastify({
		text,
		duration: 8000,
		gravity: `bottom`, // `top` or `bottom`
		position: `left`,
		avatar: ErrorAvatar,
		close: true,
		stopOnFocus: true,
		style: {
			background: `#FDE9EF`,
			border: `1px solid`,
			borderColor: `#EE1F63`,
			borderRadius: `0.5rem`,
			color: `#EE1F63`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.8rem`,
			paddingBottom: `0.9rem`,
			position: `fixed`,
			right: `7.4%`,
			marginBottom: `1%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast();
}

export function handleError(err: unknown, situation = ''): void {
	if (err instanceof AxiosError) {
		if (!err.response) {
			toastError(`Network error, please try again`);
			return;
		}
		if (err.response.status === 429) {
			toastError(`Too many requests, please try again in a minute`);
			return;
		}
		toastError(err.response.data.error);
		return;
	}
	if (err instanceof Error) {
		toastError(err.message);
		return;
	}
	throw err;
}

export function toastMessage(text: string): void {
	Toastify({
		text,
		duration: 4000,
		gravity: `bottom`, // `top` or `bottom`
		position: `left`,
		stopOnFocus: true, // Prevents dismissing of toast on hover
		avatar: MesageAvatar,
		style: {
			background: `#E8E8E8`,
			border: `1px solid`,
			borderColor: `#686868`,
			borderRadius: `0.5rem`,
			color: `#686868`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.8rem`,
			paddingBottom: `0.9rem`,
			position: `fixed`,
			right: `7.4%`,
			marginBottom: `1%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast();
}
