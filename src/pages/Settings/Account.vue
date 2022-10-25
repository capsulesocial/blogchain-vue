<script setup lang="ts">
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { toastError, toastSuccess } from '@/plugins/toast';
import { getNearPrivateKey } from '@/backend/near';
import { getEncryptedPrivateKey } from '@/backend/privateKey';

import SecondaryButton from '@/components/SecondaryButton.vue';
import BrandedButton from '@/components/BrandedButton.vue';
import FileDownloadIcon from '@/components/icons/FileDownload.vue';
import BasicSwitch from '@/components/BasicSwitch.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import EncryptKeyPopup from '@/components/popups/EncryptKeyPopup.vue';

const router = useRouter();
const store = useStore();
const settings = useStoreSettings();
const encryptionKey = ref(``);
const encrypted = ref(false);
const showEncrypted = ref(false);

useMeta({
	title: `Account Settings - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

async function downloadPrivateKey() {
	try {
		const accountId = window.localStorage.getItem(`accountId`);
		if (!accountId) {
			toastError(`Account not found, are you signed in?`);
			return;
		}
		const privateKey = encrypted.value
			? await getEncryptedPrivateKey(encryptionKey.value)
			: await getNearPrivateKey(accountId);
		const blob = new Blob([JSON.stringify({ accountId, privateKey })], { type: `application/json` });
		const link = document.createElement(`a`);
		link.href = URL.createObjectURL(blob);
		link.download = `blogchain-priv-key-${store.$state.id}.json`;
		link.click();
		URL.revokeObjectURL(link.href);
		toastSuccess(`Downloaded Blogchain private key`);
	} catch (error) {
		// $handleError(error)
	}
}

function toggleEncrypted() {
	if (encrypted.value) {
		encrypted.value = false;
		encryptionKey.value = ``;
		return;
	}
	encrypted.value = true;
	showEncrypted.value = true;
}

function closeEncrypted() {
	encrypted.value = false;
	showEncrypted.value = false;
}

function handleEncrypted(input: string) {
	if (input !== ``) {
		encryptionKey.value = input;
		encrypted.value = true;
		showEncrypted.value = false;
	}
}

function redirectProfile() {
	settings.setRecentlyInSettings(true);
	router.push(`/id/` + store.$state.id);
}
</script>
<template>
	<div id="scrollable_content" class="px-6 pt-4">
		<!-- Account Security -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Account Security</h3>
		<!-- ID -->
		<div class="mb-4 flex w-full flex-col sm:flex-row items-start sm:items-center">
			<label for="id" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm mb-2 sm:mb-0">Identifier</label>
			<input
				id="id"
				type="text"
				:placeholder="store.$state.id"
				class="cursor-not-allowed bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray2 placeholder-gray5 dark:placeholder-gray2 flex-grow w-full sm:w-min rounded-lg px-2 py-1"
				disabled
			/>
		</div>
		<!-- Export Private Key -->
		<div class="mb-8 flex w-full flex-col sm:flex-row items-start">
			<h6 class="w-48 flex-shrink-0 font-semibold text-gray5 dark:text-gray3 text-sm mb-2 sm:mb-0">
				Blogchain private key
			</h6>
			<div class="bg-gray1 dark:bg-gray7 rounded-lg pt-4 pb-5 px-6 w-full">
				<!-- Optional encryption -->
				<div class="flex flex-row justify-between mb-6">
					<label for="encryptButton" class="text-gray7 dark:text-gray2 w-4/5">
						Export my private key with a password:
					</label>
					<BasicSwitch :enabled="encrypted" :on-b-g="true" @toggle="toggleEncrypted" />
				</div>
				<div class="flex flex-col sm:flex-row items-center justify-between">
					<div class="flex flex-row items-center mb-6 sm:mb-0">
						<FileDownloadIcon class="text-primary" />
						<div>
							<h6 class="text-gray pl-4 text-lg font-semibold dark:text-darkPrimaryText">Blogchain Private Key</h6>
							<p v-if="encrypted" class="text-xs text-primary pl-4">Encrypted</p>
						</div>
					</div>
					<BrandedButton :text="`Download`" :action="downloadPrivateKey" />
				</div>
			</div>
		</div>
		<!-- Account Profile -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Account Profile</h3>
		<div class="mb-8 flex w-full flex-row items-center justify-between xl:justify-start">
			<label for="editProfile" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm">Public Profile</label>
			<button class="bg-darkBG focus:outline-none block rounded-lg xl:hidden" @click="redirectProfile">
				<PencilIcon class="m-2 h-5 w-5 text-white" />
			</button>
			<SecondaryButton :text="`Edit Profile`" :action="redirectProfile" class="hidden xl:block" />
		</div>
	</div>
	<Teleport to="body">
		<EncryptKeyPopup v-if="showEncrypted" @close="closeEncrypted" @encrypt="handleEncrypted" />
	</Teleport>
</template>
