<script setup lang="ts">
import { ref } from 'vue'
import TagCard from '@/components/TagCard.vue'
// TODO: fetch tags from store / backend
const tags = ref<string[]>([`test`])
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg">
		<div class="px-6 pb-4">
			<p v-if="tags.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no trending tags are available at the moment </span>
			</p>
			<TagCard v-for="t in tags" v-else :key="t" :tag="t" class="my-2 mr-4 text-lg" />
		</div>
	</div>
</template>
