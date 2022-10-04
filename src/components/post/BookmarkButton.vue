<script setup lang="ts">
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
import { ref } from 'vue';
import { usePostsStore } from '@/store/posts';
import { useStore } from '@/store/session';
import { toastError, toastSuccess } from '@/plugins/toast';
const props = withDefaults(
	defineProps<{
		hasBookmark: boolean;
		postcid: string;
	}>(),
	{},
);
const postsStore = usePostsStore();
const store = useStore();
const isBookmarked = ref<boolean>(props.hasBookmark);
const handleBookmark = async () => {
	try {
		await postsStore.handleBookmark(!isBookmarked.value, store.$state.id, props.postcid);
	} catch (err) {
		if (err instanceof Error) {
			toastError(err.message);
			return;
		}
		throw err;
	} finally {
		isBookmarked.value = !isBookmarked.value;
		if (isBookmarked.value) {
			toastSuccess(`You have added this post to your bookmarks`);
			return;
		}
		toastSuccess(`You have removed this post from your bookmarks`);
	}
};
</script>

<template>
	<button
		class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary w-5 h-5"
		@click="handleBookmark"
	>
		<BookmarkIcon :is-active="isBookmarked" />
	</button>
</template>
