<template>
	<div>
		<span class="text-xs text-gray5 dark:text-gray3">
			{{ formatDate(timestamp) }}
		</span>
		<div v-if="readingTime" class="h-1 w-1 rounded-full bg-gray5 dark:bg-gray3 mx-2"></div>
		<span v-if="readingTime" class="text-xs text-gray5 dark:text-gray3">{{ readingTime }} min read</span>
	</div>
</template>

<script setup lang="ts">
import { formatDate } from '@/helpers/helpers';
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		wordCount: number | undefined;
		numberOfPostImages?: number;
		timestamp: number;
	}>(),
	{
		numberOfPostImages: 0,
	},
);

const readingTime = computed(() => {
	if (!props.wordCount) {
		return null;
	}
	const textReadingTime = props.wordCount / 275;
	const photoReadingTime = (props.numberOfPostImages * ((12 * 100) / 60)) / 100;
	const readingTime = Math.round(((textReadingTime + photoReadingTime) * 60) / 100);
	return readingTime < 1 ? 1 : readingTime;
});
</script>
