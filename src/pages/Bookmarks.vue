<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue';
import SimpleFeedCard from '@/components/post/SimpleFeedCard.vue';
import BookmarksFilter from '@/components/BookmarksFilter.vue';
import BookmarksIcon from '@/components/icons/BookmarkIcon.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { BookmarkSort } from '@/backend/bookmarks';
import { usePostsStore } from '@/store/posts';
import { useStore } from '@/store/session';

const postsStore = usePostsStore();
const store = useStore();

const posts = ref<string[]>([]);
const isLoading = ref<boolean>(false);
const offset = ref<number>(0);
const limit = ref<number>(10);
const noMorePosts = ref<boolean>(false);
const category = computed(() => postsStore.$state.bookmarksCategory);

async function setSort(sort: BookmarkSort) {
	posts.value = [];
	offset.value = 0;
	noMorePosts.value = false;
	// When a user selects a filter
	postsStore.setBookmarkFilter(sort);
	await fetchContent();
}

async function fetchContent() {
	if (isLoading.value || noMorePosts.value) {
		return;
	}
	isLoading.value = true;
	const pList = await postsStore.fetchBookmarkedPosts(postsStore.bookmarksCategory, offset.value, limit.value);
	isLoading.value = false;
	if (pList && pList.length < limit.value) {
		noMorePosts.value = true;
	}
	offset.value += limit.value;
	if (!pList) {
		return;
	}
	posts.value = posts.value.concat(pList);
}

function handleScroll() {
	const body = document.getElementById(`scrollable_content`);
	if (!body) {
		return;
	}
	const currentScroll = body.scrollTop;
	// infinite scrolling
	if (currentScroll + body.clientHeight >= body.scrollHeight - 5) {
		fetchContent();
	}
}

watch(category, (c) => {
	setSort(postsStore.bookmarkFilter);
});

onMounted(async () => {
	await fetchContent();
	// scrolling event handler
	window.addEventListener('wheel', handleScroll);
	window.addEventListener('touchmove', handleScroll);
});
</script>

<template>
	<div class="flex flex-col sm:flex-row items-center justify-between px-5 pt-3 pb-3 xl:px-6 xl:pt-4">
		<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold xl:text-xl">My bookmarks</h2>
		<BookmarksFilter
			class="modal-animation mt-2 sm:mt-0"
			:filter="postsStore.$state.bookmarkFilter"
			@clicked="setSort"
		/>
	</div>
	<article
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 w-full overflow-y-auto lg:overflow-y-hidden relative"
	>
		<div v-if="posts && posts.length > 0">
			<SimpleFeedCard v-for="post in posts" :key="`new_${post}`" :fetched-post="postsStore.getPost(post)" />
		</div>
		<!-- No bookmarks present -->
		<div v-else class="mt-12 grid justify-items-center overflow-y-hidden px-6 xl:px-0">
			<div v-if="store.id !== ``" class="flex flex-col items-center">
				<p
					class="text-gray5 dark:text-gray3 align-end mb-1 flex items-end text-sm text-center"
					style="max-width: 400px"
				>
					It seems you don't have any bookmarked posts yet.
				</p>
				<p
					class="text-gray5 dark:text-gray3 align-end mb-5 flex flex-col sm:flex-row items-center sm:items-end text-sm text-center"
					style="max-width: 400px"
				>
					You can bookmark any post by clicking the<span>
						<BookmarksIcon class="h-5 w-5 fill-current" />
					</span>
					icon:
				</p>
				<SecondaryButton :text="`Home`" :action="() => $router.push(`/home`)" />
			</div>
			<div v-else class="dark:text-gray3">
				<button class="text-primary focus:outline-none mr-1" @click="$router.push(`/register`)">Sign up</button>
				to bookmark posts
			</div>
			<img v-lazy="{ src: require(`@/assets/images/brand/bookmarks.webp`) }" class="w-full" alt="Getting help" />
		</div>
		<p
			v-if="noMorePosts && posts && posts.length !== 0 && !isLoading"
			class="text-gray5 dark:text-gray3 py-5 text-center text-sm"
		>
			No more posts
		</p>
		<article v-show="isLoading" class="flex justify-center">
			<div
				class="loader m-10 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</article>
	</article>
</template>
