import { ICommentData, getCommentsOfPost, getComment, INewCommentData } from '@/backend/comment';
import { defineStore } from 'pinia';
import { handleError } from '@/plugins/toast';

export interface Comments {
	comments: Map<string, INewCommentData | ICommentData>;
	postComments: Map<string, string[]>;
	authorComments: Map<string, string[]>;
}

export const useCommentsStore = defineStore(`comments`, {
	state: (): Comments => {
		return {
			comments: new Map<string, INewCommentData | ICommentData>(),
			postComments: new Map<string, string[]>(),
			authorComments: new Map<string, string[]>(),
		};
	},
	getters: {
		getCommentData: (state: Comments) => (commentCID: string) => {
			return state.comments.get(commentCID);
		},
		getCommentsOfPost: (state: Comments) => (postCID: string) => {
			return state.postComments.get(postCID);
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
					this.$state.comments.set(c._id, c);
					postComments.push(c._id);
				}
				this.postComments.set(postCID, postComments);
			} catch (err) {
				handleError(err);
			}
		},
		fetchCommentsOfAuthor: (authorID: string) => {},
	},
});
