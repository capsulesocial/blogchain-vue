export interface Tier {
	_id?: string;
	name: string;
	description?: string;
	details?: string;
	monthlyEnabled: boolean;
	monthlyPrice: number;
	yearlyEnabled: boolean;
	yearlyPrice: number;
}

export function getEmptyTier() {
	return {
		name: ``,
		monthlyEnabled: true,
		monthlyPrice: 10,
		yearlyEnabled: true,
		yearlyPrice: 100,
	};
}
