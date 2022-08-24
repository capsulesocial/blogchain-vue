<script setup lang="ts">
import { ref } from 'vue';
import SimplePostCard from '@/components/post/SimpleCard.vue';
import BookmarksFilter from '@/components/BookmarksFilter.vue';
import { BookmarkSort } from '@/backend/bookmarks';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '@/store/posts';

const postsStore = usePostsStore();
const { posts } = storeToRefs(postsStore);

const filter = ref<string>(`BOOKMARK_DESC`);

function setSort(sort: BookmarkSort) {
	// When a user selects a filter
	filter.value = sort;
}
</script>

<template>
	<div class="flex flex-col sm:flex-row items-center justify-between px-5 pt-3 pb-3 xl:px-6 xl:pt-4">
		<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold xl:text-xl">My bookmarks</h2>
		<BookmarksFilter class="modal-animation mt-2 sm:mt-0" :filter="filter" @clicked="setSort" />
	</div>
	<article
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 w-full overflow-y-auto lg:overflow-y-hidden relative"
	>
		<div v-for="post in posts" :key="`new_${post.post._id}`">
			<SimplePostCard :fetched-post="post" />
		</div>
	</article>
</template>
