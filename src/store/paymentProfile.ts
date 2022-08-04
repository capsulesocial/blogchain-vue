export interface SubscriptionTier {
	_id: string
	username: string
	name: string
	monthlyEnabled: boolean
	monthlyPrice: number
	yearlyEnabled: boolean
	yearlyPrice: number
}
