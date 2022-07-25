import { genericRequest } from './utilities/request'

export interface SubsAnalytics {
	count: number
	date: { day: number; month: number; year: number }
}

interface IAuthorTotalRevenue {
	revenue: number
	currency: string
}

interface IAuthorRevenueBreakdown extends IAuthorTotalRevenue {
	date: { month: number; year: number }
}

interface IAuthorTotalRevenueResponse {
	subscription: IAuthorTotalRevenue
}

interface IDateRange {
	start: number
	end: number
}

interface IRevenueRange extends IDateRange {
	breakdown?: true
}

interface IViewRange extends IDateRange {
	crawler?: boolean
}

export interface OverviewResponse {
	subscribers: {
		current: number
		previous: number
	}
	views: {
		current: number
		previous: number
	}
	revenue: {
		currency: string
		current: number
		previous: number
	}
}
export interface IPostViews {
	count: number
	authenticated: boolean
}

export interface IAuthorViews {
	count: number
	date: { day: number; month: number; year: number }
}

export async function getSubsAnalytics(username: string, start: number, end: number) {
	const response = await genericRequest<IDateRange, { data: Array<SubsAnalytics> }>({
		method: `get`,
		path: `/stats/subscription`,
		params: { start, end },
		username,
	})

	return response.data
}

export async function getAuthorRevenue(username: string, start: number, end: number) {
	const response = await genericRequest<IDateRange, { data: IAuthorTotalRevenueResponse }>({
		method: `get`,
		path: `/stats/revenue`,
		params: { start, end },
		username,
	})

	return response.data
}

export async function getAuthorMonthlyRevenue(username: string, start: number, end: number) {
	const response = await genericRequest<IRevenueRange, { data: IAuthorRevenueBreakdown[] }>({
		method: `get`,
		path: `/stats/revenue`,
		params: { start, end, breakdown: true },
		username,
	})

	return response.data
}

export async function getOverview(username: string) {
	const response = await genericRequest<{ data: OverviewResponse }>({
		method: `get`,
		path: `/stats/overview`,
		username,
	})

	return response.data
}

export async function getPostViews(username: string, cid: string) {
	const response = await genericRequest<{ data: Array<IPostViews> }>({
		method: 'get',
		path: `/stats/${cid}`,
		username,
	})

	return response.data
}

export async function getAuthorViews(username: string, start: number, end: number, crawler = false) {
	const response = await genericRequest<IViewRange, { data: Array<IAuthorViews> }>({
		method: 'get',
		path: '/stats/',
		params: { start, end, crawler },
		username,
	})

	return response.data
}
