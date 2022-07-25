export interface INearConfig {
	networkId: `testnet` | `mainnet` | `betanet` | `local`
	nodeUrl: string
	contractName: string
	walletUrl: string
	helperUrl: string
	explorerUrl: string
}

export interface ILocalNetNearConfig extends Omit<INearConfig, `explorerUrl` | `helperUrl`> {
	networkId: `local`
	keyPath: string
}
