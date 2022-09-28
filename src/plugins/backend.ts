import { initIPFS } from '@capsulesocial/ipfs-wrapper';
import { initLibSodium } from '@/backend/utilities/keys';
import { initContract, initNear, initWalletConnection } from '@/backend/near';
import { nearNetwork, bootstrapNodes } from '@/backend/utilities/config';
import { toastError } from './toast';

export async function initBackend() {
	try {
		for (let i = 0; i < localStorage.length && nearNetwork === `mainnet`; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(`near-api-js:keystore`)) {
				if (key.endsWith(`testnet`)) {
					const privateKey = localStorage.getItem(key);
					if (privateKey) {
						localStorage.setItem(key.replace(`testnet`, `mainnet`), privateKey);
					}
				}
			}
		}
		const libsodium = initLibSodium();
		libsodium.initResult.catch((err: unknown) => {
			if (err instanceof Error) {
				toastError(err.message);
			}

			throw err;
		});
		const ipfs = initIPFS(bootstrapNodes, {
			start: false,
			libp2p: {
				peerStore: { persistence: false } as any,
			},
			init: { algorithm: `RSA` },
			preload: {
				enabled: false,
			},
			config: {
				Discovery: {
					MDNS: {
						Enabled: false,
					},
					webRTCStar: {
						Enabled: false,
					},
				},
				Addresses: {
					Delegates: [`/dns4/alpha.capsule.social/tcp/443/https`],
				},
				Bootstrap: undefined,
			},
		});
		ipfs.initResult.catch((err: unknown) => {
			if (err instanceof Error) {
				toastError(err.message);
			}

			throw err;
		});
		await initNear();
		initWalletConnection();

		const accountId = window.localStorage.getItem(`accountId`);
		if (accountId) {
			initContract(accountId);
			return;
		}

		initContract(``);
	} catch (err: unknown) {
		if (err instanceof Error) {
			toastError(err.message);
		}

		throw err;
	}
}
