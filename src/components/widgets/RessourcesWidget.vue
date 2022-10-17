<script setup lang="ts">
import { useRootStore } from '@/store/index';

import LinkIcon from '@/components/icons/LinkIcon.vue';

const rootStore = useRootStore();

function showOnboardingWizard() {
	rootStore.setWelcome(true);
}
</script>

<template>
	<article
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 w-full rounded-lg border px-6 pt-4 pb-5 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 font-semibold">Resources</h6>
		<button class="text-primary focus:outline-none flex flex-row items-center" @click="showOnboardingWizard">
			<LinkIcon class="mr-3 h-4 w-4" />
			<p>onboarding process</p>
		</button>
	</article>
</template>
