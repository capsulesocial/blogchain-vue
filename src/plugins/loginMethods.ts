import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui-js';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { contractName, nearNetwork, torusNetwork, torusVerifiers } from '@/backend/utilities/config';
import DirectWebSdk, { UX_MODE } from '@toruslabs/customauth';
import { WalletSelectorModal } from '@near-wallet-selector/modal-ui';

export type { WalletSelectorModal } from '@near-wallet-selector/modal-ui-js';

export interface ITorusResponse {
	userInfo: { accessToken: string; typeOfLogin: `discord` | `google` };
	privateKey: string;
}

let torus: DirectWebSdk | null = null;
export let modal: WalletSelectorModal | null = null;

export function loginWithTorus(type: `discord` | `google`) {
	if (!torus) {
		throw new Error('Torus is not initialised!');
	}

	return torus.triggerLogin(torusVerifiers[type]);
}

export default async function loginMethods(type: 'login' | 'register') {
	const torusInstance = new DirectWebSdk({
		baseUrl: location.origin,
		network: torusNetwork,
		redirectPathName: type,
		networkUrl:
			torusNetwork !== `mainnet`
				? 'https://fabled-icy-haze.ropsten.discover.quiknode.pro/933698c8050b0e71a2f79c3f69e56d91cd89904f/'
				: undefined,
		uxMode: UX_MODE.REDIRECT,
	});

	try {
		const userData = await torusInstance.getRedirectResult();
		if (userData) {
			if (!userData.error && userData.result) {
				return userData.result as ITorusResponse;
			}

			throw new Error(userData.error);
		}
	} catch (err: unknown) {
		console.log(err);
	}

	await torusInstance.init({ skipSw: true, skipPrefetch: true });
	const selector = await setupWalletSelector({
		network: nearNetwork,
		modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
	});
	modal = setupModal(selector, {
		contractId: contractName,
	});

	torus = torusInstance;
}
