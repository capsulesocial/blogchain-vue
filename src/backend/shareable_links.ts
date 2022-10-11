import axios from 'axios';
import { capsuleServer } from './utilities/config';

export async function createShareableLink(cid: string): Promise<string> {
	const response = await axios.post(`${capsuleServer}/share`, { cid });
	return response.data.data;
}
