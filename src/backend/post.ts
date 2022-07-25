import axios from 'axios'
import { nodeUrl } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'

export interface IRepost {
	authorID: string
	postCID: string
	sig: string
	timestamp: number
	type: `simple` | `quote`
	_id: string
}

export interface Tag {
	name: string
}

export interface Post {
	authorID: string
	title: string
	subtitle: string
	content: string
	category: string
	featuredPhotoCID?: string | null
	featuredPhotoCaption?: string | null
	timestamp: number
	tags: Tag[]
	encrypted?: boolean
	postImages?: Array<string>
}

export interface IRegularPost extends Post {
	encrypted?: false
}

export interface IEncryptedPost extends Post {
	encrypted: true
	subtitle: string
}

export type RetrievedPost = Omit<Post, `content`> & {
	_id: string
	excerpt: string
	wordCount?: number
	enabledTiers?: string[]
}

export interface IGenericPostResponse {
	post: RetrievedPost
	bookmarked: boolean
	reposted?: string
	viewsCount?: number
	bookmarksCount: number
	commentsCount: number
	repostCount: number
	repost?: IRepost
}

export type IPostResponse = Omit<IGenericPostResponse, `repost`>
export type IPostResponseWithHidden = IPostResponse & { hidden: boolean }
export interface IRepostResponse extends IGenericPostResponse {
	repost: IRepost
	deleted: boolean
}

export type Algorithm = `NEW` | `FOLLOWING` | `TOP`
export type Timeframe = `1` | `7` | `30` | `365`

export interface IGetPostsOptions {
	sort?: Algorithm
	offset?: number
	limit?: number
	following?: string
}

export async function getPosts(
	filter: {
		category?: string
		authorID?: string
		tag?: string
		bookmarkedBy?: string
		timeframe?: Timeframe
		encrypted?: boolean
	},
	bookmarker: string,
	options: IGetPostsOptions,
): Promise<IPostResponse[] | IRepostResponse[]> {
	const { sort, offset = 0, limit = 10, following } = options
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`No following provided`)
	}
	const res = await axios.get(`${nodeUrl()}/content`, {
		params: {
			...filter,
			sort,
			...(following && sort === `FOLLOWING` ? { following } : {}),
			offset,
			limit,
			bookmarker,
		},
	})
	return res.data.data
}

export async function getOnePost(cid: string, bookmarker: string): Promise<IPostResponseWithHidden> {
	const res = await axios.get(`${nodeUrl()}/content/${cid}`, {
		params: { bookmarker },
	})
	return res.data.data
}

export async function sendPostDeletion(postCID: string, authorID: string) {
	const action = `HIDE`
	const event = {
		action,
		postCID,
		timestamp: Date.now(),
		authorID,
	}

	const { sig } = await signContent(event)

	await axios.post(`${nodeUrl()}/posts`, {
		event,
		sig: uint8ArrayToHexString(sig),
	})
}
