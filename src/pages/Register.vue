<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CapsuleIcon from '@/components/icons/CapsuleIcon.vue';
import RegisterMethods from '@/components/register/RegisterMethods.vue';
import SignUp from '@/components/register/SignUp.vue';
import useLogin, { Status } from '@/plugins/loginMethods';
import router from '@/router';
import { toastError, toastWarning } from '@/plugins/toast';

const isLoading = ref(false);
const step = ref<`registerMethods` | `signUp`>(`registerMethods`);
const login = useLogin();

onMounted(async () => {
	try {
		isLoading.value = true;
		const userData = await login.loginMethods('register');
		if (userData) {
			const res = await login.verify(userData.privateKey);
			switch (res) {
				case Status.NO_ACCOUNT:
					// If no username is found then register...
					toastWarning(`looks like you don't have an account`);
					return;
				case Status.BLOCKED:
					// If account is blocked then send to register page...
					toastError(`Your account has been deactivated or banned`);
					router.push(`/home`);
					return;
				case Status.SUCCESS:
					router.push(`/home`);
					location.reload();
					return;
			}
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
