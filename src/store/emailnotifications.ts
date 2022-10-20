import { defineStore } from 'pinia';

import {
	IEmailSubscription,
	deleteSubscription,
	listForAuthor,
	startEmailSubscription,
	EmailSubscriptionMode,
	listEmails,
	listAllAuthors,
} from '@/backend/emails';
import { handleError, toastSuccess } from '@/plugins/toast';

export interface EmailSubsciptions {
	emailSubsciptionMap: Record<string, IEmailSubscription[]>;
}

export const emailNotificationssStore = defineStore(`emailnotifications`, {
	state: (): EmailSubsciptions => {
		return {
			emailSubsciptionMap: {},
		};
	},
	persist: true,
	getters: {
		getEmailSubsciption: (state: EmailSubsciptions) => (authorId: string) => {
			if (state.emailSubsciptionMap[authorId]) {
				return state.emailSubsciptionMap[authorId];
			}
		},
	},
	actions: {
		async fetchNewsletters(authorId: string, username: string) {
			if (!authorId || !username) {
				return;
			}
			try {
				const fetchedNewsletters = await listForAuthor(authorId, username);
				this.emailSubsciptionMap[authorId] = fetchedNewsletters;
			} catch (error) {
				handleError(error);
			}
		},
		async deleteEmailSubsciption(authorId: string, username: string) {
			try {
				await deleteSubscription(username, authorId);
				toastSuccess(`Email subscription deleted successfully 🎉`);
			} catch (err) {
				handleError(err);
			}
		},
		async createEmailSubscription(
			authorID: string,
			email: string,
			topics: string[] = [],
			mode: EmailSubscriptionMode = EmailSubscriptionMode.AllPosts,
			username: string,
		) {
			if (!authorID || !username) {
				return;
			}
			try {
				await startEmailSubscription(authorID, email, topics, mode, username);
				this.fetchNewsletters(authorID, username);
			} catch (err) {
				handleError(err);
			}
		},
		async listUserEmails(username: string, authorID: string) {
			if (!username || !authorID) {
				return;
			}
			try {
				return await listEmails(username, authorID);
			} catch (err) {
				handleError(err);
			}
		},
		async listAuthors(username: string) {
			if (!username) {
				return;
			}
			try {
				return await listAllAuthors(username);
			} catch (error) {
				handleError(error);
			}
		},
	},
});
