<script setup lang="ts">
import { TorusVerifiers } from '@/backend/utilities/config'
import CapsuleIcon from '@/components/icons/CapsuleIcon.vue'
import { ref } from 'vue'

interface ITorusResponse {
	userInfo: { accessToken: string; typeOfLogin: `discord` | `google` }
	privateKey: string
}

const userInfo = ref<null | ITorusResponse>(null)
const isLoading = ref<boolean>(true)

async function torusLogin(type: TorusVerifiers) {}
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
				<div class="-mt-5 flex w-full flex-col items-center p-14">
					<!-- Step 1: Choose Login / register -->
					<article v-show="!userInfo && !isLoading" class="w-full lg:w-3/4 xl:w-1/2">
						<h1 class="text-lightPrimaryText dark:text-gray1 mb-10 font-semibold" style="font-size: 2.6rem">Log in</h1>
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
								:class="$colorMode.dark ? `LoginInfoOpenDark` : `LoginInfoOpen`"
								style="top: 55px; right: 0"
							>
								This is a Blogchain-specific key, not a NEAR seed phrase. We will never ask for your NEAR seed phrase
								and make sure you are only importing your Blogchain key to https://blogchain.app/login
							</div>
						</div>
						<p class="text-gray7 dark:text-gray3 mt-10 text-center text-sm xl:text-base">
							Don't have an account yet?
							<nuxt-link to="/register" class="text-primary text-center font-bold">Sign up</nuxt-link>
						</p>
					</article>
					<!-- Step 2: Sign up -->
					<article v-show="!isLoading" class="w-full lg:w-3/4 xl:w-1/2">
						<div v-show="userInfo && username === null">
							<h1 class="text-primary text-4xl font-bold">Signup</h1>
							Looks like you don't have an account. Sign up
						</div>
					</article>
					<article v-show="isLoading" class="modal-animation flex w-full justify-center lg:w-3/4">
						<div
							class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
							:style="`border-top: 2px solid` + $color.hex"
						></div>
					</article>
				</div>
			</section>
			<p class="text-gray5 dark:text-gray3 px-4 pl-10 text-sm">© {{ currentYear }} Capsule Social, Inc.</p>
		</div>
	</main>
</template>
