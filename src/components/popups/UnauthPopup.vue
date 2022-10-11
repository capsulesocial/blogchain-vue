<script setup lang="ts">
import CloseIcon from '@/components/icons/XIcon.vue';
import BrandedButton from '@/components/BrandedButton.vue';

import { onMounted } from 'vue';

import { useRootStore } from '@/store/index';
import { useStore } from '@/store/session';
import { useRouter } from 'vue-router';

const store = useStore();
const rootStore = useRootStore();
const router = useRouter();

//methods
function handleClose(e: any) {
	if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
		return;
	}
	if (e.target.firstChild.classList[0] === `popupCard`) {
		closePopup();
	}
}
function closePopup() {
	rootStore.toggleUnauthPopup(false);
}

onMounted(async () => {
	window.addEventListener(`click`, handleClose, false);
});
</script>
<template>
	<div
		v-if="rootStore.$state.showUnauthPopup && store.$state.id === ``"
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-40 flex h-screen w-full items-start justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popupCard w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation mt-12 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-4xl font-semibold">Who's there?</h1>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="closePopup">
					<CloseIcon />
				</button>
			</div>
			<article class="flex flex-col items-center text-center">
				<img loading="lazy" src="@/assets/images/reactions/default.webp" class="mb-5 w-10/12" />
				<h6 class="mb-5 text-xl font-bold text-lightPrimaryText dark:text-darkPrimaryText">
					You need an account to do that
				</h6>
				<p class="text-gray5 dark:text-gray3 mb-10 px-10">
					Create a Blogchain account to publish posts, follow your favorite content creators and personalise your
					Blogchain
				</p>
				<!-- Next button -->
				<div class="mb-2">
					<BrandedButton
						:action="
							() => {
								router.push(`/register`), closePopup();
							}
						"
						:text="`Create an account 🚀`"
					/>
				</div>
				<p class="text-gray7 dark:text-gray3 mt-2 mb-4 text-center text-sm">
					Already have an account?
					<router-link to="/login" class="text-primary text-center font-bold" @click="closePopup()">Log in</router-link>
				</p>
			</article>
		</div>
	</div>
</template>
