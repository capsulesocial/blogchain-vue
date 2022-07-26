import axios from 'axios';
import libsodium from './utilities/keys';
import { nodeUrl } from './utilities/config';
import { uint8ArrayToHexString } from './utilities/helpers';

export async function sendPostDeletion(action: `HIDE`, postCID: string, authorID: string) {
	const event = {
		action,
		postCID,
		timestamp: Date.now(),
		authorID,
	};

	const { sig } = await libsodium().signContent(event);

	await axios.post(`${nodeUrl()}/posts`, {
		event,
		sig: uint8ArrayToHexString(sig),
	});
}
