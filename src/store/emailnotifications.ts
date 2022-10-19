import { defineStore } from 'pinia';

import {
	IEmailSubscription,
	deleteSubscription,
	listForAuthor,
	startEmailSubscription,
	EmailSubscriptionMode,
	listEmails,
	UserEmail,
	listAllAuthors,
} from '@/backend/emails';
import { handleError, toastSuccess } from '@/plugins/toast';

export interface EmailSubsciptions {
	emailSubsciptionMap: Record<string, IEmailSubscription[]>;
	userListEmails: Record<string, UserEmail[]>;
}

export const emailNotificationssStore = defineStore(`emailnotifications`, {
	state: (): EmailSubsciptions => {
		return {
			emailSubsciptionMap: {},
			userListEmails: {},
		};
	},
	persist: true,
	getters: {
		getEmailSubsciption: (state: EmailSubsciptions) => (authorId: string) => {
			if (state.emailSubsciptionMap[authorId]) {
				return state.emailSubsciptionMap[authorId];
			}
		},
		getUserEmailList: (state: EmailSubsciptions) => (authorId: string) => {
			if (state.userListEmails[authorId]) {
				return state.userListEmails[authorId];
			}
			return [];
		},
	},
	actions: {
		async fetchNewsletters(authorId: string, username: string) {
			const fetchedNewsletters = await listForAuthor(authorId, username);
			if (fetchedNewsletters !== undefined) {
				this.emailSubsciptionMap[authorId] = fetchedNewsletters;
			}
			return [];
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
			try {
				await startEmailSubscription(authorID, email, topics, mode, username);
				this.fetchNewsletters(authorID, username);
			} catch (err) {
				handleError(err);
			}
		},
		async listUserEmails(username: string, authorID: string) {
			try {
				const userEmails = await listEmails(username, authorID);
				if (userEmails !== undefined) {
					this.userListEmails[authorID] = userEmails;
				}
			} catch (err) {
				handleError(err);
			}
		},
		async listAuthors(username: string) {
			try {
				return await listAllAuthors(username);
			} catch (error) {
				handleError(error);
			}
		},
	},
});
