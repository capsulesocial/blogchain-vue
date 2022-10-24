export function isError(obj: Record<string, unknown>): obj is { error: string } {
	return `error` in obj;
}

export function getIpfsPhoto(cid: string) {
	return cid;
}
