import { defineStore } from 'pinia';
import { getCommentsOfPost, sendComment, INewCommentData } from '@/backend/comment';
import { handleError, toastSuccess } from '@/plugins/toast';

export const useCommentsStore = defineStore(`comments`, {
	state: () => {
		return {
			comments: [],
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
				const fcomments = await getCommentsOfPost(postCid, offset, limit);
				this.comments.push(fcomments);
				console.log(fcomments);
			} catch (error: unknown) {
				handleError(error);
			}
		},
		async sendUserComment(content: INewCommentData, type: `comment` | `reply`): Promise<void> {
			if (!content || !type) {
				return;
			}
			try {
				const _id = await sendComment(content, type);
				if (_id) {
					toastSuccess(type === `comment` ? `Comment sent successfully 🎉  ` : `Reply sent successfully 🎉  `);
				}
			} catch (error: unknown) {
				handleError(error);
			}
		},
	},
});
