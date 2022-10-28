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
import { toastWarning } from './toast';
import { useProfilesStore } from '@/store/profiles';
import { baseDecode } from 'borsh';
import { revokeDiscordKey } from '@/backend/discordRevoke';

export type { WalletSelectorModal } from '@near-wallet-selector/modal-ui-js';

export interface ITorusResponse {
	userInfo: { accessToken: string; typeOfLogin: `discord` | `google` };
	privateKey: string;
}

let torus: DirectWebSdk | null = null;
let modal: WalletSelectorModal | null = null;

export enum Status {
	NO_ACCOUNT,
	BLOCKED,
	SUCCESS,
}

export default function useLogin() {
	const store = useStore();
	const profilesStore = useProfilesStore();

	function loginWithTorus(type: `discord` | `google`) {
		if (!torus) {
			throw new Error('Torus is not initialised!');
		}

		return torus.triggerLogin(torusVerifiers[type]);
	}

	async function verify(privateKey: string, accountIdInput?: string): Promise<Status> {
		let accountId = accountIdInput;
		if (!accountId) {
			accountId = getAccountIdFromPrivateKey(privateKey);
		}

		const username = await getUsernameNEAR(accountId);

		if (!username) {
			return Status.NO_ACCOUNT;
		}

		const { blocked } = await getUserInfoNEAR(username);
		if (blocked) {
			return Status.BLOCKED;
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
		return Status.SUCCESS;
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
					const res = userData.result as ITorusResponse;
					if (res.userInfo.typeOfLogin === 'discord') {
						try {
							await revokeDiscordKey(res.userInfo.accessToken);
						} catch (err) {
							toastWarning(
								`We couldn't revoke the Discord key, this might hinder you to login again for the next 30 minutes`,
							);
						}
					}

					return res;
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
