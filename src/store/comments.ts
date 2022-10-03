import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
	getCommentsOfPost,
	sendComment,
	INewCommentData,
	getComment,
	ICommentData,
	getCommentsOfUser,
} from '@/backend/comment';

import { sendPostDeletion } from '@/backend/postDeletion';
import { handleError, toastSuccess } from '@/plugins/toast';

export const useCommentsStore = defineStore(`comments`, {
	state: () => {
		const comments = ref<ICommentData[]>([]);
		return {
			comments,
		};
	},
	persist: false,
	getters: {},
	actions: {
		async fetchComments(postCid: string, offset: number, limit: number) {
			if (!postCid) {
				return;
			}
			try {
				const fcomments: ICommentData[] = await getCommentsOfPost(postCid, offset, limit);
				this.comments = fcomments;
				return fcomments;
			} catch (error: unknown) {
				handleError(error);
			}
		},

		async sendUserComment(content: INewCommentData, type: `comment` | `reply`) {
			if (!content || !type) {
				return;
			}
			try {
				const _id: string = await sendComment(content, type);
				if (type === `comment`) {
					this.comments.push({ _id, ...content });
				}
				// if reply return _id and assign to the added reply _id
				return _id;
				toastSuccess(type === `comment` ? `Comment sent successfully 🎉  ` : `Reply sent successfully 🎉  `);
			} catch (error: unknown) {
				handleError(error);
			}
		},

		async getCommentReplies(postCid: string, offset: number, limit: number) {
			if (!postCid) {
				return;
			}
			try {
				return await getCommentsOfPost(postCid, offset, limit);
			} catch (error: unknown) {
				handleError(error);
			}
		},

		async fetchComment(cid: string) {
			if (!cid) {
				return;
			}
			try {
				return await getComment(cid);
			} catch (error: unknown) {
				handleError(error);
			}
		},

		async removeComment(action: `HIDE`, postCID: string, authorID: string): Promise<void> {
			if (!action || !postCID || !authorID) {
				return;
			}
			try {
				await sendPostDeletion(action, postCID, authorID);
				// soft delete the comment from the store state
				this.$state.comments = this.comments.filter((comment) => !(comment._id === postCID));
				toastSuccess(`This comment has been successfully removed`);
			} catch (error) {
				handleError(error);
			}
		},

		async fetchUserComments(authorID: string, offset: number, limit: number) {
			if (!authorID || !offset || !limit) {
				return;
			}
			return await getCommentsOfUser(authorID, offset, limit);
		},
	},
});
