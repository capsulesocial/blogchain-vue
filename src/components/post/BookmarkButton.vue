<script setup lang="ts">
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
defineProps({
	hasBookmark: {
		type: Boolean,
		required: true,
	},
});
</script>

<template>
	<button
		class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary w-4 h-4"
		@click="() => {}"
	>
		<BookmarkIcon />
	</button>
</template>
