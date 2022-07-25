import { ILocalNetNearConfig, INearConfig } from './near'

export const capsuleOrbit = process.env.VUE_APP_ORBIT_URL || `https://payments.capsule.social/orbit`
export const capsuleServer = (process.env.VUE_APP_CAPSULE_SERVER as string) || `https://payments.capsule.social/server`
export const baseUrl = process.env.VUE_APP_BASE_URL || `https://payments.capsule.social`
export const contractName = (process.env.VUE_APP_CONTRACT_NAME as string) || `dev-1635323648697-81373157539648`

const nearNetwork = (process.env.NEAR_NETWORK as string) || `testnet`
const homeDir = (process.env.HOME_DIR as string) || `/home/capsule`
const nearNodeUrl = (process.env.NEAR_NODE_URL as string) || `http://localhost:3030`
const nearWalletUrl = (process.env.NEAR_WALLET_URL as string) || `http://localhost:4000/wallet`

const defaultBootstraps = [
	`/dns4/node1.blogchain.app/tcp/443/wss/p2p/12D3KooW9qeCwGnG7ncn1YFh7Kth7oH93TCmMuAzdafV8WwGTMkX`,
	`/dns4/node2.blogchain.app/tcp/443/wss/p2p/12D3KooWBidnLf4iRGgZpeFVCqQjNzAsSx2opZPbG8o9tpCf2rG5`,
	`/dns4/node3.blogchain.app/tcp/443/wss/p2p/12D3KooWLtqhi2h8Mnb7NxfEWuAkVEkTi9FVLQPDV1PZ3ioQooW2`,
	`/dns4/node4.blogchain.app/tcp/443/wss/p2p/12D3KooWRzXVsB3cf57W9KzDD97EFVcQZFP8Cb4XBbmwK3SK3tME`,
	`/dns4/alpha.capsule.social/tcp/443/wss/p2p/12D3KooWF5TY7Wisj3nZzfoE2uKTxUpBAooUSUU8yucsJnkBxbpo`,
]

export const bootstrapNodes = process.env.BOOTSTRAP_NODES ? JSON.parse(process.env.BOOTSTRAP_NODES) : defaultBootstraps

export function getNearConfig(): INearConfig | ILocalNetNearConfig {
	switch (nearNetwork) {
		case `testnet`:
			return {
				networkId: `testnet`,
				nodeUrl: `https://rpc.testnet.near.org`,
				contractName,
				walletUrl: `https://wallet.testnet.near.org`,
				helperUrl: `https://helper.testnet.near.org`,
				explorerUrl: `https://explorer.testnet.near.org`,
			}
		case `mainnet`:
			return {
				networkId: `mainnet`,
				nodeUrl: `https://rpc.mainnet.near.org`,
				contractName,
				walletUrl: `https://wallet.near.org`,
				helperUrl: `https://helper.mainnet.near.org`,
				explorerUrl: `https://explorer.mainnet.near.org`,
			}
		case `betanet`:
			return {
				networkId: `betanet`,
				nodeUrl: `https://rpc.betanet.near.org`,
				contractName,
				walletUrl: `https://wallet.betanet.near.org`,
				helperUrl: `https://helper.betanet.near.org`,
				explorerUrl: `https://explorer.betanet.near.org`,
			}
		case `local`:
			return {
				networkId: `local`,
				nodeUrl: nearNodeUrl,
				keyPath: `${homeDir}/.near/validator_key.json`,
				walletUrl: nearWalletUrl,
				contractName,
			}
		default:
			throw new Error(`Invalid NEAR network type`)
	}
}

export function nodeUrl() {
	const preferredNodeUrl = window.localStorage.getItem(`preferredNodeUrl`)
	if (!preferredNodeUrl) {
		return capsuleOrbit
	}

	return preferredNodeUrl + `/orbit`
}
