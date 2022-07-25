import { genericRequest } from './utilities/request'

export interface AuthorSubs {
	subscriptionId: string
	authorID: string
	username: string
	tier: { name: string; id: string }
	createdAt: number
	isActive: boolean
	expiredAt: number | null
	renewalInfo?: {
		message?: string
		lastInvoiceId?: string
		invoiceCreationDate: number
		invoiceUpdationDate: number
		dueDate: number | null
		status: string
	}
}

export interface SubsTransaction {
	transactionId: string
	receiptUrl: string
	currency: string
	amount: number
	createdAt: number
	status: string
}

export interface FilterAuthorSubs {
	skip?: number
	limit?: number
	tierId?: string
}

export interface SubsResponse {
	subscriptions: AuthorSubs[]
	total: number
	pages: number
}

export type SubsSort = 'CREATED_LATEST' | 'CREATED_EARLIEST'

export async function getAuthorSubscriptions(
	username: string,
	filter?: FilterAuthorSubs,
	sort: SubsSort = 'CREATED_LATEST',
	isActive?: 'true' | 'false' | undefined,
) {
	const response = await genericRequest<unknown, SubsResponse>({
		method: `get`,
		path: `/subscription/author`,
		params: {
			...filter,
			...(sort ? { sort } : {}),
			...(isActive ? { isActive } : {}),
		},
		username,
	})

	return response
}

export async function cancelSubscription(username: string, subscriptionId: string) {
	await genericRequest({
		method: `post`,
		path: `/subscription/unsubscribe`,
		username,
		body: { subscriptionId },
	})
}

export async function getSubscriptionTransactions(username: string, subscriptionId: string) {
	const res = await genericRequest<{ data: Array<SubsTransaction> }>({
		method: `get`,
		path: `/subscription/transactions/${subscriptionId}`,
		username,
	})

	return res.data
}

export async function refundTransaction(username: string, transactionId: string) {
	await genericRequest({
		method: `post`,
		path: `/subscription/transactions/refund`,
		username,
		body: { transactionId },
	})
}
