<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMeta } from 'vue-meta';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/store/session';
import { useStoreTag } from '@/store/tags';

import BackIcon from '@/components/icons/ChevronLeft.vue';
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

import { Algorithm } from '@/backend/post';

const router = useRouter();
const store = useStore();
const route = useRoute();
const tagStore = useStoreTag();

const tagParam: string = route.params.tag as string;

useMeta({
	title: `${tagParam} posts on Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

const isLoading = ref<boolean>(true);
const noMorePosts = ref<boolean>(false);
const fromExternalSite = ref<boolean>(false);
const posts = computed(() => tagStore.$state.tagPosts);
const algorithm = ref<Algorithm>(Algorithm.NEW);

// Check if coming from external site
router.beforeEach((to, from, next): void => {
	next((vm: any): void => {
		if (to && from.name === null) {
			fromExternalSite.value = true;
		}
	});
});

onMounted(async (): Promise<void> => {
	tagStore.fetchPostswithTag(tagParam, store.$state.id, algorithm.value, 0, 10);
});

// methods
function handleBack(): void {
	if (fromExternalSite.value) {
		router.push(`/home`);
		return;
	}
	router.go(-1);
}
function toggleHomeFeed(): void {
	router.push(`/home`);
}

isLoading.value = false;
</script>

<template>
	<div id="scrollable_content">
		<!-- Tag page header -->
		<div class="border-lightBorder bg-gray7 flex flex-row items-center rounded-lg bg-opacity-25 p-2 shadow-lg">
			<button class="bg-gray1 focus:outline-none m-3 flex-shrink-0 rounded-full" @click="handleBack">
				<BackIcon />
			</button>
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">{{ tagParam }}</h2>
		</div>
		<!-- Posts loaded -->
		<div ref="container" class="min-h-130 h-130 xl:min-h-150 xl:h-150 w-full overflow-y-auto">
			<article
				v-if="Object.keys(posts).length === 0 && !isLoading"
				class="mt-10 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
			>
				<p class="text-gray5 dark:text-gray3 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
					It seems there are no posts under this topic yet
				</p>
				<SecondaryButton :text="`Back home`" :action="toggleHomeFeed" />
				<img src="@/assets/images/brand/tag.webp" loading="lazy" class="top-0 mt-64 xl:mt-10" />
			</article>
			<article v-for="post in posts" :key="post['post._id']">
				<PostCardContainer :fetched-post="post" />
			</article>
			<p v-if="noMorePosts" class="text-gray5 dark:text-gray3 py-5 text-center text-sm">No more posts</p>
			<!-- Not loaded yet -->
			<article v-show="isLoading" class="flex w-full justify-center mt-12">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</article>
		</div>
	</div>
</template>
