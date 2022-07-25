import { Tier } from '@/interfaces/Tier'
import { genericRequest } from './utilities/request'

export interface IStripeRefreshResponse {
	isLoading?: boolean
	stripeConnected: boolean
	paymentsEnabled: boolean
	currency?: string
	details?: {
		email: string | null
		connectedId: string
		message: string
		reasons?: string[]
	}
}

export async function generateStripeOnboard(username: string) {
	const data = await genericRequest({
		method: 'post',
		path: `/pay/stripe/connect/onboard`,
		username,
		body: {},
	})
	return data.url
}

export async function refreshStripeAccount(username: string) {
	const data = await genericRequest<{ shouldUpdate: boolean }, IStripeRefreshResponse>({
		method: 'post',
		path: `/pay/stripe/connect/refresh`,
		username,
		body: { shouldUpdate: true },
	})

	return data
}

export async function retrievePaymentProfile(username: string) {
	const data = await genericRequest({
		method: 'get',
		path: `/pay/profile/${username}`,
	})
	return data
}

export async function retrievePayouts(username: string) {
	const data = await genericRequest({
		method: 'get',
		path: `/pay/stripe/connect/payouts`,
		username,
	})
	return data
}

export async function createTierBackend(username: string, tier: Omit<Tier, '_id'>) {
	const data = await genericRequest({
		method: 'post',
		path: `/pay/tiers/`,
		username,
		body: tier,
	})
	return data
}

export async function retrieveSubscriptionTiers(username: string) {
	const data = await genericRequest({
		method: 'get',
		path: '/pay/tiers/',
		username,
	})
	return data
}

export async function updateTierBackend(username: string, tierId: string, tier: Tier) {
	const data = await genericRequest({
		method: 'put',
		path: `/pay/tiers/${tierId}`,
		username,
		body: {
			monthlyEnabled: tier.monthlyEnabled,
			monthlyPrice: tier.monthlyPrice,
			name: tier.name.trim(),
			description: tier.description?.trim(),
			details: tier.details?.trim(),
			yearlyEnabled: tier.yearlyEnabled,
			yearlyPrice: tier.yearlyPrice,
		},
	})
	return data
}

export async function deleteTierBackend(username: string, tier: Tier) {
	const data = await genericRequest({
		method: 'delete',
		path: `/pay/tiers/${tier._id}`,
		username,
	})
	return data
}
