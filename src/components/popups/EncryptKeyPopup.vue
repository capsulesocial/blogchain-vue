<script setup lang="ts">
import { ref } from 'vue';
import BrandedButton from '@/components/BrandedButton.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import EyeIcon from '@/components/icons/PreviewIcon.vue';

const emit = defineEmits([`close`, `encrypt`]);

const seePassword = ref<boolean>(false);
const encryptedPassword = ref<string>(``);

function handleEncryption() {
	emit(`encrypt`, encryptedPassword.value);
}
</script>

<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<div
			class="w-full lg:w-600 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<div class="flex flex-row justify-between items-center">
				<!-- title, close button -->
				<h2 class="text-xl font-semibold text-lightPrimaryText dark:text-darkPrimaryText">Encrypt your private key</h2>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<p class="mt-4 mb-6 text-gray5 dark:text-gray3">
				Add a password to encrypt your private key as an additional security precaution. Your private key password
				cannot be changed or recovered and will be required on login. Once logged in, you can re-encrypt your private
				key with a new password in the Settings page
			</p>
			<div class="relative w-full bg-gray2 dark:bg-gray7 rounded-lg px-4 py-3">
				<input
					v-model="encryptedPassword"
					:type="seePassword ? `text` : `password`"
					class="w-full focus:outline-none bg-transparent pr-6 text-lightPrimaryText dark:text-darkPrimaryText"
					placeholder="Enter password"
				/>
				<button
					class="absolute text-gray5 dark:text-gray3 w-4 h-4"
					style="right: 1rem; top: 1.1rem"
					@click="seePassword = !seePassword"
				>
					<EyeIcon />
				</button>
			</div>
			<div class="flex justify-end mt-8">
				<BrandedButton
					:action="handleEncryption"
					:text="`Encrypt`"
					:class="encryptedPassword === `` ? `opacity-50 cursor-not-allowed` : ``"
					:disabled="encryptedPassword === ``"
				/>
			</div>
		</div>
	</div>
</template>
