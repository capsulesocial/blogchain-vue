import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui-js';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { contractName, nearNetwork, torusNetwork, torusVerifiers } from '@/backend/utilities/config';
import DirectWebSdk, { UX_MODE } from '@toruslabs/customauth';
import { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { getAccountIdFromPrivateKey, setNearUserFromPrivateKey } from '@/backend/auth';
import { getUserInfoNEAR, getUsernameNEAR, initContract, setNearPrivateKey } from '@/backend/near';
import { createSessionFromProfile, useStore } from '@/store/session';
import { toastError, toastWarning } from './toast';
import router from '@/router';
import { useProfilesStore } from '@/store/profiles';
import { baseDecode } from 'borsh';

export type { WalletSelectorModal } from '@near-wallet-selector/modal-ui-js';

export interface ITorusResponse {
	userInfo: { accessToken: string; typeOfLogin: `discord` | `google` };
	privateKey: string;
}

export default function useLogin() {
	const store = useStore();
	const profilesStore = useProfilesStore();

	let torus: DirectWebSdk | null = null;
	let modal: WalletSelectorModal | null = null;

	function loginWithTorus(type: `discord` | `google`) {
		if (!torus) {
			throw new Error('Torus is not initialised!');
		}

		return torus.triggerLogin(torusVerifiers[type]);
	}

	async function verify(privateKey: string, accountIdInput?: string) {
		let accountId = accountIdInput;
		if (!accountId) {
			accountId = getAccountIdFromPrivateKey(privateKey);
		}

		const username = await getUsernameNEAR(accountId);

		if (!username) {
			// If no username is found then register...
			toastWarning(`looks like you don't have an account`);
			router.push(`/register`);
			return;
		}

		const { blocked } = await getUserInfoNEAR(username);
		if (blocked) {
			// If account is blocked then send to register page...
			toastError(`Your account has been deactivated or banned`);
			router.push(`/home`);
			return;
		}

		if (accountIdInput) {
			await setNearPrivateKey(baseDecode(privateKey), accountId);
		} else {
			await setNearUserFromPrivateKey(privateKey);
		}

		initContract(accountId);

		await profilesStore.fetchProfile(username);
		const profile = profilesStore.getProfile(username);

		const account = createSessionFromProfile(profile);
		store.setID(account.id);
		store.setName(account.name);
		store.setEmail(account.email);
		store.setAvatar(account.avatar);
		store.setBio(account.bio);
		store.setLocation(account.location);
		store.setWebsite(account.website ? account.website : ``);

		// Login
		window.localStorage.setItem(`accountId`, accountId);
		router.push(`/home`);
		location.reload();
	}

	async function loginMethods(type: 'login' | 'register') {
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

	return { modal, loginWithTorus, verify, loginMethods };
}
