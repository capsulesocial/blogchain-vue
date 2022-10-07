import {
	getCommentsOfPost,
	getCommentsOfUser,
	INewCommentData,
	sendComment,
	ICommentData,
	getCommentsStats,
} from '@/backend/comment';
import { sendPostDeletion } from '@/backend/postDeletion';
import { defineStore } from 'pinia';
import { handleError, toastSuccess } from '@/plugins/toast';
import { Emotions, EmotionCategories } from '@/config/config';
import { ICommentsStats } from '@/backend/comment';

export interface Comments {
	postComments: Map<string, ICommentData[]>;
	authorComments: Map<string, ICommentData[]>;
	commentsStats: Map<string, ICommentsStats>;
}

export const useCommentsStore = defineStore(`comments`, {
	state: (): Comments => {
		return {
			postComments: new Map<string, ICommentData[]>(),
			authorComments: new Map<string, ICommentData[]>(),
			commentsStats: new Map<string, ICommentsStats>(),
		};
	},
	getters: {
		getCommentStats: (state: Comments) => (postCID: string) => {
			return state.commentsStats.get(postCID);
		},
		getCommentsOfPost: (state: Comments) => (postCID: string) => {
			return state.postComments.get(postCID);
		},
		getCommentsOfAuthor: (state: Comments) => (authorID: string) => {
			return state.authorComments.get(authorID);
		},
	},
	actions: {
		async fetchCommentsStats(postCID: string) {
			try {
				const stats = await getCommentsStats(postCID);
				this.commentsStats.set(postCID, stats);
			} catch (err) {
				handleError(err);
			}
		},
		async sendResponse(content: INewCommentData, type: `comment` | `reply`) {
			if (!content || !type) {
				return;
			}
			try {
				await sendComment(content, type);
			} catch (error: unknown) {
				handleError(error);
			} finally {
				this.fetchCommentsOfPost(content.parentCID);
				toastSuccess(type === `comment` ? `Comment sent successfully 🎉  ` : `Reply sent successfully 🎉  `);
			}
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

				this.postComments.set(postCID, res);
				return res;
			} catch (err) {
				handleError(err);
			}
		},
		async fetchCommentsOfAuthor(authorID: string, offset = 0, limit = 10) {
			try {
				const res = await getCommentsOfUser(authorID, offset, limit);
				this.authorComments.set(authorID, res);
				return res;
			} catch (err) {
				handleError(err);
			}
		},
		async removeUserComment(commentId: string, username: string, parentCID?: string) {
			if (!commentId || !username) {
				return;
			}

			try {
				await sendPostDeletion(`HIDE`, commentId, username);
			} catch (error: unknown) {
				handleError(error);
			} finally {
				if (parentCID) {
					await this.fetchCommentsOfPost(parentCID);
				}
				toastSuccess(
					parentCID ? `This comment has been successfully removed 🎉 ` : `This reply has been successfully removed 🎉 `,
				);
			}
		},
	},
});
