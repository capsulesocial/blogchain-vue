import { avatars } from '@/config/avatars'

export function keyChecker(x: Array<string>, y?: string) {
	if (!y) {
		return false
	}
	return x.indexOf(y) > -1
}

export const lastMonthDate = () => {
	// First and Last day Date of previous month
	const date = new Date()
	date.setDate(1)
	date.setMonth(date.getMonth() - 1)
	const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
	const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
	const startEnd = { monthStartDay, monthEndDay }
	return startEnd
}

export function dateConvert(timestampMs: number) {
	return new Date(timestampMs).toDateString()
}

export function usernameToPicture(username: string, buckets = 11): number {
	let x = 0
	for (let i = 0; i < username.length; i++) {
		x += username.charCodeAt(i)
	}
	const v = ((Math.sin(x) + 1) * (buckets - 1)) / 2
	return avatars[Math.floor(v)]
}

export function getAvatar(cid: string): Promise<string | ArrayBuffer> | null {
	return null
	// return getPhotoFromIPFS(cid)
}
