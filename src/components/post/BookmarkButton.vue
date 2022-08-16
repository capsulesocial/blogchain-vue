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
		class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary w-5 h-5"
		@click="() => {}"
	>
		<BookmarkIcon />
	</button>
</template>
