<script setup lang="ts">
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
withDefaults(
	defineProps<{
		hasBookmark: boolean;
		postcid: string;
	}>(),
	{},
);
</script>

<template>
	<button
		class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary w-5 h-5"
		style="margin-top: 2px"
		@click="() => {}"
	>
		<BookmarkIcon :is-active="hasBookmark" />
	</button>
</template>
