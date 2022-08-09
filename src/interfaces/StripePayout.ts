export interface StripePayout {
	id: string;
	createdAt: Date;
	amount: number;
	currency: string;
	method: string;
	status: string;
}

export interface StripePayouts {
	payoutList: StripePayout[];
}
