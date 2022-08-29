<script setup lang="ts">
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '@/store/posts';
import BackIcon from '@/components/icons/ChevronLeft.vue';
import SimplePostCard from '@/components/post/SimpleCard.vue';

useMeta({
	title: `dynamicCategory category on Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

const route = useRoute();
const postsStore = usePostsStore();

const { posts } = storeToRefs(postsStore);
const category = ref<string>(route.params.category as string);
</script>

<template>
	<!-- Header -->
	<div
		id="header"
		class="bg-darkBG dark:bg-lightBG border-lightBorder animatefast flex h-56 w-full flex-row items-center rounded-lg shadow-lg"
		:style="{
			background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(${require(`@/assets/images/category/` +
				$route.params.category +
				`/` +
				`header.webp`)})`,
			backgroundSize: 'cover',
		}"
	>
		<div class="flex h-full flex-col justify-between px-4 py-5 xl:px-6">
			<button class="focus:outline-none relative flex">
				<div class="bg-gray1 z-10 flex-shrink-0 rounded-full">
					<BackIcon />
				</div>
				<p
					id="buttontitle"
					class="animatefast pl-3 pr-4 font-semibold text-lightPrimaryText dark:text-darkPrimaryText"
					style="z-index: 1"
				>
					All categories
				</p>
				<!-- <h2
					id="hiddentitle"
					class="text-lightPrimaryText dark:text-darkPrimaryText animatelong absolute ml-8 -mt-1 px-2 text-xl font-semibold capitalize opacity-0"
				>
					{{ category.replace(`-`, ` `) }}
				</h2> -->
				<div
					id="buttonbg"
					class="bg-lightBG animatefast absolute h-full rounded-full bg-opacity-50"
					style="width: 155px; z-index: 0"
				></div>
			</button>
			<h2
				id="title"
				class="text-lightOnPrimaryText animatefast font-semibold capitalize"
				style="font-size: 1.875rem; line-height: 38px"
			>
				{{ category.replace(`-`, ` `) }}
			</h2>
		</div>
	</div>
	<!-- Posts -->
	<article
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 w-full overflow-y-auto lg:overflow-y-hidden relative"
	>
		<div v-for="post in posts" :key="`new_${post.post._id}`">
			<SimplePostCard :fetched-post="post" />
		</div>
	</article>
</template>
