import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getCommentsOfPost, sendComment, INewCommentData, getComment, ICommentData } from '@/backend/comment';
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
				const fcomments = await getCommentsOfPost(postCid, offset, limit);
				this.comments = fcomments;
				return fcomments;
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
					this.comments.push({ _id, ...content });
					toastSuccess(type === `comment` ? `Comment sent successfully 🎉  ` : `Reply sent successfully 🎉  `);
				}
			} catch (error: unknown) {
				handleError(error);
			}
		},
		async fetchComment(cid: string) {
			if (!cid) {
				return;
			}
			try {
				const fcomment = await getComment(cid);
				return fcomment;
			} catch (error: unknown) {
				handleError(error);
			}
		},
		async deleteComment() {},
	},
});
