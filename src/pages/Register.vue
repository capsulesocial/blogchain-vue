<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CapsuleIcon from '@/components/icons/CapsuleIcon.vue';
import RegisterMethods from '@/components/register/RegisterMethods.vue';
import SignUp from '@/components/register/SignUp.vue';
import loginMethods from '@/plugins/loginMethods';

const isLoading = ref<boolean>(false);
const step = ref<`registerMethods` | `signUp`>(`registerMethods`);

onMounted(async () => {
	try {
		isLoading.value = true;
		const userData = await loginMethods('register');
		if (userData) {
			console.log(userData);
		}
		isLoading.value = false;
	} catch (err) {
		console.log(err);
	}
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
				<div v-show="!isLoading" class="flex w-full h-full flex-col justify-center items-center px-14">
					<!-- Step 1: Choose Login / register -->
					<RegisterMethods v-if="step === `registerMethods`" />
					<SignUp v-else-if="step === `signUp`" />
				</div>
			</section>
			<p class="text-gray5 dark:text-gray3 px-4 py-5 pl-10 text-sm">
				© {{ new Date().getFullYear().toString() }} Capsule Social, Inc.
			</p>
		</div>
	</main>
</template>
