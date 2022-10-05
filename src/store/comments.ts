import { getCommentsOfPost, getCommentsOfUser, getComment, INewCommentData, sendComment } from '@/backend/comment';
import { defineStore } from 'pinia';
import { handleError, toastSuccess } from '@/plugins/toast';
import { Emotions, EmotionCategories } from '@/config/config';

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
		async sendResponse(content: INewCommentData, type: `comment` | `reply`) {
			if (!content || !type) {
				return;
			}
			try {
				const _id: string = await sendComment(content, type);
				this.comments.set(_id, content);
			} catch (error: unknown) {
				handleError(error);
			} finally {
				this.fetchCommentsOfPost(content.parentCID);
				toastSuccess(type === `comment` ? `Comment sent successfully 🎉  ` : `Reply sent successfully 🎉  `);
			}
		},
		async fetchComment(cid: string) {
			const c = await getComment(cid);
			this.$state.comments.set(cid, c);
			return c;
		},
		async fetchCommentsOfPost(
			postCID: string,
			offset = 0,
			limit = 10,
			emotion?: Emotions,
			emotionCategory?: EmotionCategories,
		) {
			try {
				const res = await getCommentsOfPost(postCID, offset, limit, emotion, emotionCategory);
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
		async fetchCommentsOfAuthor(authorID: string, offset = 0, limit = 10) {
			try {
				const res = await getCommentsOfUser(authorID, offset, limit);
				let authorComments: string[] = [];
				const existingArr = this.authorComments.get(authorID);
				if (typeof existingArr !== `undefined`) {
					authorComments = authorComments.concat(existingArr);
				}
				for (const c of res) {
					const comment = await getComment(c._id);
					this.$state.comments.set(c._id, comment);
					authorComments.push(c._id);
				}
				this.authorComments.set(authorID, authorComments);
				return res;
			} catch (err) {
				handleError(err);
			}
		},
	},
});
