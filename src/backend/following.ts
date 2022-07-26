import axios from 'axios';
import { nodeUrl } from './utilities/config';
import libsodium from './utilities/keys';
import { uint8ArrayToHexString } from './utilities/helpers';
import cache from './utilities/caching';

export interface IFollowData {
	action: `FOLLOW` | `UNFOLLOW`;
	subject: string;
	object: string;
	timestamp: number;
}

export async function followChange(action: `FOLLOW` | `UNFOLLOW`, self: string, user: string) {
	const data: IFollowData = {
		action,
		subject: self,
		object: user,
		timestamp: Date.now(),
	};

	const { sig } = await libsodium().signContent(data);

	await axios.post(`${nodeUrl()}/follow`, {
		event: data,
		sig: uint8ArrayToHexString(sig),
	});
}

async function _getFollowersAndFollowing(user: string): Promise<{ followers: Set<string>; following: Set<string> }> {
	const response = await axios.get(`${nodeUrl()}/follow/${user}`);

	const { followers, following } = response.data.data;

	return { followers: new Set(followers), following: new Set(following) };
}

export const getFollowersAndFollowing = cache(_getFollowersAndFollowing);
