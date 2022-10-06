<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStore } from '@/store/session';
import { usePostsStore } from '@/store/posts';
import HorizontalBookmarkPreview from '@/components/HorizontalBookmarkPreview.vue';

const store = useStore();
const postsStore = usePostsStore();

// TODO: fetch followers from store / backend
const bookmarks = computed(() => postsStore.getBookmarkedPosts());
onMounted(() => {
	postsStore.fetchBookmarkedPosts();
});
</script>

<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4 relative">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">Recent Bookmarks</h3>
		<!-- Loading spinner -->
		<div v-if="store.$state.id !== ``">
			<div v-if="bookmarks">
				<article v-if="bookmarks.length == 0">
					<p class="text-gray5 dark:text-gray3 mb-4 text-sm">
						<span>
							You haven't bookmarked any posts yet. Click the bookmark icon on a post to add it to your bookmark list
						</span>
					</p>
				</article>
				<HorizontalBookmarkPreview v-for="b in bookmarks.slice(0, 2)" :key="b" :cid="b" />
				<router-link to="/bookmarks" class="text-primary text-sm">Show more</router-link>
			</div>
		</div>
		<div v-else class="text-gray5 dark:text-gray3 text-sm px-6 pb-4">
			<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
			to save bookmarks
		</div>
	</div>
</template>
