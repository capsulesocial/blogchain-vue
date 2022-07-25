import axios from 'axios'
import { capsuleServer } from './utilities/config'
import { genericRequest } from './utilities/request'

export type TLockedPostSort = 'CREATED_AT_ASC' | 'CREATED_AT_DESC'
export interface IGetLockedPostsOption {
	sort?: TLockedPostSort
	limit?: number
	skip?: number
}

export interface IServerPost {
	cid: string
	enabledTiers: string[]
	viewsCount: number
}

export async function getLockedPosts(filter: { authorId: string; tierId?: string }, options: IGetLockedPostsOption) {
	const { limit = 10, skip = 0, sort = 'CREATED_AT_DESC' } = options
	const response = await axios.get(`${capsuleServer}/content/posts/${filter.authorId}`, {
		params: {
			...filter,
			sort,
			limit,
			skip,
		},
	})
	return response.data
}

export async function updatePostTier(username: string, cid: string, tiers: string[]) {
	await genericRequest({
		method: 'post',
		path: `/content/${cid}/tiers`,
		body: { tiers },
		username,
	})
}

export async function getLockedPostTiers(cid: string) {
	const res = await genericRequest<{ data: Array<string> }>({
		method: 'get',
		path: `/content/${cid}/tiers`,
	})

	return res.data
}

export async function getBulkPosts(username: string, cids: string[]) {
	const res = await genericRequest<{ cids: string[] }, { data: Array<IServerPost> }>({
		method: 'post',
		path: `/content/posts/bulk`,
		body: { cids },
		username,
	})
	return res.data
}
