import axios from 'axios'
import cache from './utilities/caching'
import { nodeUrl } from './utilities/config'

export interface Profile {
	id: string
	name: string
	email: string
	bio: string
	location: string
	avatar: string
	socials: string[]
	website?: string
	background?: string
}

export function createDefaultProfile(id: string): Profile {
	return {
		id,
		name: ``,
		email: ``,
		bio: ``,
		location: ``,
		avatar: ``,
		website: ``,
		socials: [],
	}
}

export const getProfile = cache(_getProfile)

async function _getProfile(authorID: string) {
	const response = await axios.get(`${nodeUrl()}/profile/${authorID}`)
	if (response.data.data) {
		return response.data.data as {
			profile: Profile | null
			totalPostsCount: number
		}
	}
	throw new Error(`Error finding profile!`)
}
