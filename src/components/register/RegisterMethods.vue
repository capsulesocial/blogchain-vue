<script setup lang="ts">
import { ref } from 'vue';
import DiscordIcon from '@/components/icons/DiscordIcon.vue';
import GoogleIcon from '@/components/icons/brands/Google.vue';
import NearIcon from '@/components/icons/brands/Near.vue';
import InfoIcon from '@/components/icons/Info.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';

// Refs
const isLoading = ref<boolean>(false);
const showInfos = ref<boolean>(false);

defineEmits([`close`]);
// Methods
const torusLogin = (type: `discord` | `google`) => {};
const walletLoginComponent = () => {};
const implicitAccountCreate = () => {};
</script>

<template>
	<article class="w-full lg:w-3/4 xl:w-1/2">
		<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</div>
		<div v-show="!isLoading">
			<h1 class="text-lightPrimaryText dark:text-gray1 mb-10 font-semibold" style="font-size: 2.6rem">Sign up</h1>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-2"
				@click="() => torusLogin('discord')"
			>
				<DiscordIcon style="width: 28px; height: 28px; color: #8c9eff" />
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Sign up with Discord</h6>
			</button>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none flex w-full items-center justify-center rounded-lg py-2"
				@click="() => torusLogin('google')"
			>
				<GoogleIcon style="width: 28px; height: 28px" />
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Sign up with Google</h6>
			</button>
			<div class="my-6 flex w-full items-center justify-center">
				<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
				<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
				<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
			</div>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
				@click="walletLoginComponent"
			>
				<NearIcon style="width: 22px; height: 22px" />
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Signup with NEAR</h6>
			</button>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
				@click="implicitAccountCreate"
			>
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Generate a Blogchain private key</h6>
			</button>
			<button
				class="w-full flex flex-row items-center justify-center text-center mt-10 text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary text-sm"
				@click="showInfos = true"
			>
				<InfoIcon class="mr-3 h-4 w-4" />
				<p>What Signup method should I choose?</p>
			</button>
			<p class="text-gray7 dark:text-gray3 mt-10 text-center">
				Already have an account?
				<router-link to="/login" class="text-primary text-center font-bold">Log in</router-link>
			</p>
		</div>
	</article>
	<teleport to="body">
		<div
			v-if="showInfos"
			class="popup bg-darkBG dark:bg-gray5 modal-animation z-30 absolute top-0 right-0 flex h-full w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.stop="showInfos = false"
		>
			<div class="flex w-full justify-center">
				<!-- Container -->
				<section>
					<div
						class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 mr-5 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
					>
						<div class="sticky flex items-center justify-between">
							<h2 class="text-lightPrimaryText dark:text-gray1 text-2xl font-semibold">Sign Up Methods</h2>
							<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
								<CloseIcon />
							</button>
						</div>
						<div class="text-sm">
							<div class="flex flex-col my-4">
								<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with Google</h4>
								<p class="my-2 text-gray5 dark:text-gray3">
									Signing up on Blogchain requires writing data on the blockchain through transactions on a smart
									contract with small amounts of NEAR token. You’ll need to solve the captcha to verify your human
									identity and enable Capsule Social to sponsor you with NEAR tokens. Blogchain and Capsule Social
									doesn't store or track any information from your Google account. To log in, use your Google account or
									import your Blogchain private key under “Import private key”.
								</p>
							</div>
							<div class="flex flex-col my-4">
								<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with Discord</h4>
								<p class="my-2 text-gray5 dark:text-gray3">
									Signing up on Blogchain requires writing data on the blockchain through transactions on a smart
									contract with small amounts of NEAR token. You’ll need to solve the captcha to verify your human
									identity and enable Capsule Social to sponsor you with NEAR tokens. Blogchain and Capsule Social
									doesn't store or track information on your accounts. To log in, use your Discord account or import
									your Blogchain private key under “Import private key”.
								</p>
							</div>
							<div class="flex flex-col my-4">
								<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with NEAR</h4>
								<p class="my-2 text-gray5 dark:text-gray3">
									Create an account using your NEAR wallet. You will need to self-fund your account with NEAR tokens
									sufficient for running the transaction on the smart contract and registering your account on the
									blockchain. By signing up with NEAR, you need to download your Blogchain private key and use it to log
									in under “Import private key”.
								</p>
							</div>
							<div class="flex flex-col my-4">
								<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with Blogchain private key</h4>
								<p class="my-2 text-gray5 dark:text-gray3">
									Create an account where you self manage your account keys. You’ll need solve the captcha to verify
									your human identity and enable Capsule Social to sponsor you with NEAR tokens. These NEAR tokens are
									used for performing transactions on a smart contract and registering your account on the blockchain.
									By signing up with this method, you’ll need to download your Blogchain private key and use it to log
									in under “Import Blogchain private key”.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</teleport>
</template>
