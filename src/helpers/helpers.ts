import { avatars } from '@/config/avatars';

type dateString = (date: Date, hideYear?: boolean, preformattedDate?: string | null, onlyDate?: boolean) => string;

const MONTH_NAMES = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export function keyChecker(x: Array<string>, y?: string) {
	if (!y) {
		return false;
	}
	return x.indexOf(y) > -1;
}

export const lastMonthDate = () => {
	// First and Last day Date of previous month
	const date = new Date();
	date.setDate(1);
	date.setMonth(date.getMonth() - 1);
	const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
	const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
	const startEnd = { monthStartDay, monthEndDay };
	return startEnd;
};

export function dateConvert(timestampMs: number) {
	return new Date(timestampMs).toDateString();
}

export function usernameToPicture(username: string, buckets = 11): number {
	let x = 0;
	for (let i = 0; i < username.length; i++) {
		x += username.charCodeAt(i);
	}
	const v = ((Math.sin(x) + 1) * (buckets - 1)) / 2;
	return avatars[Math.floor(v)];
}

export function getAvatar(cid: string): Promise<string | ArrayBuffer> | null {
	return null;
	// return getPhotoFromIPFS(cid)
}

const getFormat: dateString = (date, hideYear = false, preformattedDate = null, onlyDate = false) => {
	const day = date.getDate();
	const month = MONTH_NAMES[date.getMonth()];
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	if (onlyDate) {
		return `${day} ${month} ${year}`;
	}

	let minutesString = `${minutes}`;
	if (minutes < 10) {
		// Adding leading zero to minutes
		minutesString = `0${minutes}`;
	}

	if (preformattedDate) {
		// Today at 4:20
		return `${preformattedDate} at ${hours}:${minutesString}`;
	}

	if (hideYear) {
		return `${day} ${month} at ${hours}:${minutesString}`;
	}

	return `${day} ${month} ${year} at ${hours}:${minutesString}`;
};

export function formatDate(input: string | Date | number, dateOnly = false) {
	const date = input instanceof Date ? input : new Date(input);
	const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
	const today = new Date();
	const seconds = Math.round((today.getTime() - date.getTime()) / 1000);

	if (seconds < 0 || dateOnly) {
		return getFormat(date, false, null, true);
	}

	if (seconds < 5) {
		return `now`;
	}
	if (seconds < 60) {
		return `${seconds} seconds ago`;
	}

	const minutes = Math.round(seconds / 60);
	if (minutes < 60) {
		return `${minutes} minutes ago`;
	}

	const yesterday = new Date(today.getTime() - DAY_IN_MS);
	const isToday = today.toDateString() === date.toDateString();
	const isYesterday = yesterday.toDateString() === date.toDateString();
	if (isToday) {
		return getFormat(date, true, `Today`);
	}
	if (isYesterday) {
		return getFormat(date, true, `Yesterday`);
	}

	const isThisYear = today.getFullYear() === date.getFullYear();
	if (isThisYear) {
		return getFormat(date, true);
	}

	return getFormat(date);
}
