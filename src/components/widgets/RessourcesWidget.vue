<script setup lang="ts">
import LinkIcon from '@/components/icons/LinkIcon.vue';
</script>

<template>
	<article
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 w-full rounded-lg border px-6 pt-4 pb-5 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 font-semibold">Resources</h6>
		<button class="text-primary focus:outline-none flex flex-row items-center">
			<LinkIcon class="mr-3 h-4 w-4" />
			<p>onboarding process</p>
		</button>
	</article>
</template>
