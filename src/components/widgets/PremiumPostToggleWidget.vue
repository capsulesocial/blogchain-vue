<script setup lang="ts">
import { ref } from 'vue';
import PremiumSwitch from '@/components/PremiumSwitch.vue';

//should correspond to draft.encrypted
const dummyencrypted = ref<boolean>(false);
</script>
<template>
	<!-- check if user has activated his premium profile to display this one -->
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border p-6 py-5 shadow-lg">
		<div class="flex flex-row justify-between items-center">
			<div class="flex flex-col items-start">
				<p class="text-gray5 dark:text-gray3 text-sm">This post is for subscribers only</p>
				<button
					class="text-neutral text-sm mt-1"
					:class="dummyencrypted ? `` : `opacity-50 cursor-not-allowed`"
					:disabled="!dummyencrypted"
				>
					Manage access
				</button>
			</div>
			<PremiumSwitch :enabled="dummyencrypted" />
		</div>
	</article>
</template>
