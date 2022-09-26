export interface ISignedIPFSObject<T> {
	data: T;
	sig: string;
	public_key: string;
}

export const validFileTypes = [`png`, `jpeg`, `jpg`, `avif`, `webp`];
export const validMimeTypes = validFileTypes.map((t) => `image/${t}`);

export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
	return Buffer.from(uint8Array).toString(`hex`);
}

export function hexStringToUint8Array(hexString: string): Uint8Array {
	return new Uint8Array(Buffer.from(hexString, `hex`));
}

export function getBlobExtension(blob: Blob): string | null {
	switch (blob.type) {
		case `image/png`:
			return `.png`;
		case `image/jpeg`:
			return `.jpeg`;
		case `image/jpg`:
			return `.jpg`;
		case `image/avif`:
			return `.avif`;
		case `image/webp`:
			return `.webp`;
		default:
			return null;
	}
}

export function getExpTimestamp() {
	return Date.now() + 5 * 60 * 1000;
}
