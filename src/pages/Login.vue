<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import BrandedButton from '@/components/BrandedButton.vue';
import CapsuleIcon from '@/components/icons/CapsuleIcon.vue';
import DiscordIcon from '@/components/icons/brands/Discord.vue';
import GoogleIcon from '@/components/icons/brands/Google.vue';
import FileIcon from '@/components/icons/File.vue';
import InfoIcon from '@/components/icons/Info.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import { useStore } from '../store/session';
import router from '@/router/index';
import { toastError } from '@/plugins/toast';
import { getDecryptedPrivateKey } from '@/backend/privateKey';
import useLogin from '@/plugins/loginMethods';

let accountId: string | null = null;
let privateKey: string | null = null;

// refs
const isLoading = ref(false);
const showInfo = ref(false);
const currentYear = ref(new Date().getFullYear().toString());
const noAccount = ref(false);
const key = ref<HTMLInputElement>();
const showPasswordPopup = ref(false);
const passwordInput = ref<HTMLInputElement>();
const password = ref(``);
const store = useStore();
const login = useLogin();
const keyFileTarget = ref<HTMLInputElement | null>(null);

function handleKeyClick() {
	if (key.value) {
		key.value.click();
	}
}

function handleKey(e: Event) {
	keyFileTarget.value = e.target as HTMLInputElement;
	const target = keyFileTarget.value;
	const files = target.files;

	if (files && files.length > 0) {
		const keyFile = files[0];
		const reader: FileReader = new FileReader();
		reader.readAsText(keyFile);
		if (reader === null) {
			return;
		}

		reader.onload = (i: Event) => {
			if (i.target !== null && reader.result !== null) {
				try {
					const key = JSON.parse(reader.result.toString());
					if (key.privateKey.startsWith(`encrypted:`)) {
						privateKey = key.privateKey;
						accountId = key.accountId;
						showPasswordPopup.value = true;
						nextTick(() => {
							passwordInput.value?.focus();
						});
						return;
					}

					return login.verify(key.privateKey, key.accountId);
				} catch (err: unknown) {
					if (keyFileTarget.value) {
						keyFileTarget.value = null;
					}
					if (err instanceof Error) {
						toastError(err.message);
						return;
					}

					throw err;
				}
			}
		};
	}
}
function decryptKey() {
	// This gets global vars
	if (!accountId || !privateKey) {
		throw new Error('Unexpected!');
	}

	getDecryptedPrivateKey(password.value, accountId, privateKey).then((pk) => {
		if (!pk) {
			toastError(`Password incorrect`);
			return;
		}
		return login.verify(pk);
	});
}
async function torusLogin(type: 'discord' | 'google') {
	isLoading.value = true;
	await login.loginWithTorus(type);
	isLoading.value = false;
}

// Lifecycle
onMounted(async () => {
	isLoading.value = true;
	const accountIdLocalStorage = window.localStorage.getItem(`accountId`);
	if (store.$state.id !== `` && accountIdLocalStorage) {
		router.push(`/home`);
		return;
	}
	const res = await login.loginMethods('login');
	if (!res) {
		isLoading.value = false;
		return;
	}
	return login.verify(res.privateKey);
});
</script>

<template>
	<main
		class="bg-img-unauth m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/auth.webp`)})` }"
	>
		<div
			style="backdrop-filter: blur(10px)"
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r lg:w-3/5"
		>
			<CapsuleIcon class="pt-6 pl-10 text-lightPrimaryText dark:text-gray1" />
			<section class="flex items-center justify-center" style="height: 86%">
				<div v-show="isLoading" class="modal-animation flex w-full justify-center lg:w-3/4 xl:w-1/2 z-20">
					<div
						class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl border-top border-primary"
						:style="`border-top: 2px solid`"
					></div>
				</div>
				<div v-show="!isLoading" class="-mt-5 flex w-full flex-col items-center p-14">
					<!-- Step 1: Choose Login / register -->
					<article v-if="!noAccount" class="w-full lg:w-3/4 xl:w-1/2">
						<h1 class="text-lightPrimaryText dark:text-gray1 mb-10 font-semibold font-serif" style="font-size: 2.6rem">
							Log in
						</h1>
						<button
							class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-2"
							@click="() => torusLogin('discord')"
						>
							<DiscordIcon style="width: 28px; height: 28px" />
							<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Log in with Discord</h6>
						</button>
						<button
							class="bg-gray2 dark:bg-gray7 focus:outline-none flex w-full items-center justify-center rounded-lg py-2"
							@click="() => torusLogin('google')"
						>
							<GoogleIcon style="width: 28px; height: 28px" />
							<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Log in with Google</h6>
						</button>
						<div class="my-6 flex w-full items-center justify-center">
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
							<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
						</div>
						<div class="flex w-full mb-4 relative">
							<button
								class="bg-gray2 dark:bg-gray7 mr-2 focus:outline-none flex w-full items-center justify-center rounded-lg py-3"
								@click="handleKeyClick"
							>
								<FileIcon />
								<span class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">
									Import Blogchain private key
								</span>
								<input id="key" ref="key" type="file" name="key" accept=".json" class="hidden" @change="handleKey" />
							</button>
							<div
								class="bg-gray2 dark:bg-gray7 focus:outline-none rounded-lg p-3 flex justify-center items-center cursor-pointer"
								@mouseenter="showInfo = true"
								@mouseleave="showInfo = false"
							>
								<InfoIcon class="h-6 w-6 text-gray5 dark:text-gray3" />
							</div>
							<div
								v-show="showInfo"
								class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
								style="top: 55px; right: 0"
							>
								This is a Blogchain-specific key, not a NEAR seed phrase. We will never ask for your NEAR seed phrase
								and make sure you are only importing your Blogchain key to https://blogchain.app/login
							</div>
						</div>
						<p class="text-gray7 dark:text-gray3 mt-10 text-center text-sm xl:text-base">
							Don't have an account yet?
							<router-link to="/register" class="text-primary text-center font-bold">Sign up</router-link>
						</p>
					</article>
					<!-- Step 2: Sign up -->
					<article v-show="!isLoading" class="w-full lg:w-3/4 xl:w-1/2">
						<div v-if="noAccount">
							<h1 class="text-primary text-4xl font-bold">Signup</h1>
							Looks like you don't have an account. Sign up
						</div>
					</article>
					<article v-show="isLoading" class="modal-animation flex w-full justify-center lg:w-3/4">
						<div
							class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
							:style="`border-top: 2px solid`"
						></div>
					</article>
				</div>
			</section>
			<p class="text-gray5 dark:text-gray3 px-4 pl-10 text-sm">© {{ currentYear }} Capsule Social, Inc.</p>
		</div>
	</main>
	<!-- Decrypt key popup -->
	<Teleport to="#popup">
		<div
			v-if="showPasswordPopup"
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="showPasswordPopup = false"
		>
			<!-- Container -->
			<div
				class="w-full lg:w-600 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
			>
				<div class="flex flex-row justify-between items-center">
					<!-- title, close button -->
					<h2 class="text-xl font-semibold">Private key protected</h2>
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="showPasswordPopup = false">
						<CloseIcon />
					</button>
				</div>
				<p class="mt-4 text-gray5 dark:text-gray3">
					This is a password-protected private key. To decrypt and login, please enter the password associated with this
					account:
				</p>
				<input
					ref="passwordInput"
					v-model="password"
					type="password"
					class="w-full bg-gray2 dark:bg-gray7 mt-6 rounded-lg px-4 py-3 focus:outline-none"
					placeholder="Enter password"
					@keyup.enter="decryptKey"
				/>
				<div class="flex justify-end mt-8">
					<BrandedButton
						:action="decryptKey"
						:text="`Login`"
						:class="password === `` ? `opacity-50 cursor-not-allowed` : ``"
						:disabled="password === ``"
					/>
				</div>
			</div>
		</div>
	</Teleport>
</template>
