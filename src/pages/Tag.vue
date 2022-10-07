<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useMeta } from 'vue-meta';
import PostCardContainerVue from '@/components/post/PostCardContainer.vue';
import BackIcon from '@/components/icons/ChevronLeft.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostsStore } from '@/store/posts';

const router = useRouter();
const route = useRoute();
const postsStore = usePostsStore();

const tag = computed(() => {
	if (typeof route.params.tag !== `string`) {
		throw new Error(`route.params.tag should be a string!`);
	}
	return route.params.tag;
});

useMeta({
	title: `${tag.value} posts on Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

const tagPosts = computed(() => postsStore.getPostsWithTag(tag.value));
const isLoading = ref<boolean>(true);
const noMorePosts = ref<boolean>(false);
const fromExternalSite = ref<boolean>(false);
const scrollContainer = ref<HTMLElement | null>(null);
const limit = ref<number>(10);
const offset = ref<number>(0);

// Check if coming from external site
router.beforeEach((to, from, next) => {
	next(() => {
		if (to && from.name === null) {
			fromExternalSite.value = true;
		}
	});
});
function handleBack() {
	if (fromExternalSite.value) {
		router.push(`/home`);
		return;
	}
	router.go(-1);
}
function toggleHomeFeed() {
	router.push(`/home`);
}
const scrollListener = async (e: Event) => {
	if (isLoading.value) {
		return;
	}
	const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
	if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading.value && !noMorePosts.value) {
		isLoading.value = true;
		postsStore.fetchTagPosts(tag.value, offset.value, limit.value).then((res) => {
			if (res && res.length < limit.value) {
				noMorePosts.value = true;
			}
			offset.value += limit.value;
			isLoading.value = false;
		});
	}
};

onMounted(() => {
	if (scrollContainer.value) {
		scrollContainer.value.addEventListener('scroll', scrollListener);
	}
	postsStore.fetchTagPosts(tag.value, offset.value, limit.value).then((res) => {
		if (res && res.length < limit.value) {
			noMorePosts.value = true;
		}
		offset.value += limit.value;
		isLoading.value = false;
	});
});
</script>

<template>
	<!-- Tag page header -->
	<div class="border-lightBorder bg-gray7 flex flex-row items-center rounded-lg bg-opacity-25 p-2 shadow-lg">
		<button class="bg-gray1 focus:outline-none m-3 flex-shrink-0 rounded-full" @click="handleBack">
			<BackIcon />
		</button>
		<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">{{ tag }}</h2>
	</div>
	<!-- Posts loaded -->
	<div
		id="scrollable_content"
		ref="scrollContainer"
		class="min-h-130 h-130 xl:min-h-150 xl:h-150 w-full overflow-y-auto"
	>
		<article
			v-if="tagPosts?.length == 0 && !isLoading"
			class="mt-10 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
		>
			<p class="text-gray5 dark:text-gray3 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
				It seems there are no posts under this topic yet
			</p>
			<SecondaryButton :text="`Back home`" :action="toggleHomeFeed" />
			<img :src="require(`@/assets/images/brand/tag.webp`)" loading="lazy" class="top-0 mt-64 xl:mt-10" />
		</article>
		<article v-for="p in tagPosts" :key="p">
			<PostCardContainerVue :fetched-post="postsStore.getPost(p)" />
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
</template>
