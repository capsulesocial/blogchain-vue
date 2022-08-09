<script setup lang="ts">
import { ref } from 'vue';
import TagCard from '@/components/TagCard.vue';
// TODO: fetch tags from store / backend
const tags = ref<string[]>([`test`]);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2">Trending topics</h3>
		<div class="">
			<p v-if="tags.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no trending topics are available at the moment </span>
			</p>
			<TagCard v-for="t in tags" v-else :key="t" :tag="t" class="my-2 mr-4 text-lg" />
		</div>
	</div>
</template>
