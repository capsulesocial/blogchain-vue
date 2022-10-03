import { getCommentsOfPost, getCommentsOfUser, getComment, INewCommentData } from '@/backend/comment';
import { defineStore } from 'pinia';
import { handleError } from '@/plugins/toast';

export interface Comments {
	comments: Map<string, INewCommentData>;
	postComments: Map<string, string[]>;
	authorComments: Map<string, string[]>;
}

export const useCommentsStore = defineStore(`comments`, {
	state: (): Comments => {
		return {
			comments: new Map<string, INewCommentData>(),
			postComments: new Map<string, string[]>(),
			authorComments: new Map<string, string[]>(),
		};
	},
	getters: {
		getCommentData:
			(state: Comments) =>
			(commentCID: string): INewCommentData | undefined => {
				const c = state.comments.get(commentCID);
				if (c) {
					return c;
				}
				return undefined;
			},
		getCommentsOfPost: (state: Comments) => (postCID: string) => {
			return state.postComments.get(postCID);
		},
		getCommentsOfAuthor: (state: Comments) => (authorID: string) => {
			return state.authorComments.get(authorID);
		},
	},
	actions: {
		async fetchComment(cid: string) {
			const c = await getComment(cid);
			this.$state.comments.set(cid, c);
			return c;
		},
		async fetchCommentsOfPost(
			postCID: string,
			offset = 0,
			emotion?: string,
			emotionCategory?: `negative` | `neutral` | `positive`,
		) {
			try {
				const res = await getCommentsOfPost(postCID, offset, 10, emotion, emotionCategory);
				const postComments: string[] = [];
				for (const c of res) {
					const comment = await getComment(c._id);
					this.$state.comments.set(c._id, comment);
					postComments.push(c._id);
				}
				this.postComments.set(postCID, postComments);
			} catch (err) {
				handleError(err);
			}
		},
		async fetchCommentsOfAuthor(authorID: string, offset = 0) {
			try {
				const res = await getCommentsOfUser(authorID, offset, 10);
				const authorComments: string[] = [];
				for (const c of res) {
					const comment = await getComment(c._id);
					this.$state.comments.set(c._id, comment);
					authorComments.push(c._id);
				}
				this.authorComments.set(authorID, authorComments);
			} catch (err) {
				handleError(err);
			}
		},
	},
});
