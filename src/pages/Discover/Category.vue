<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '@/store/posts';
import BackIcon from '@/components/icons/ChevronLeft.vue';
import SimpleFeedCard from '@/components/post/SimpleFeedCard.vue';

const route = useRoute();
const postsStore = usePostsStore();

const { posts } = storeToRefs(postsStore);
const category = ref<string>(route.params.category as string);
const lastScroll = ref<number>(0);
const isScrollingDown = ref<boolean>(false);

useMeta({
	title: `${category.value.charAt(0).toUpperCase() + category.value.slice(1)} category on Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

function collapse() {
	const body = document.getElementById(`scrollable_content`);
	const header = document.getElementById(`header`);
	const buttontitle = document.getElementById(`buttontitle`);
	const buttonbg = document.getElementById(`buttonbg`);
	const title = document.getElementById(`title`);
	const hiddentitle = document.getElementById(`hiddentitle`);
	const scrollUp = `scrollup`;
	const scrollDown = `scrolldown`;
	const opacity0 = `opacity0`;
	const opacity1 = `opacity1`;
	if (!body || !buttontitle || !buttonbg || !title || !hiddentitle || !header) {
		return;
	}
	const currentScroll = body.scrollTop;
	if (currentScroll > lastScroll.value && !header.classList.contains(scrollDown)) {
		// down
		isScrollingDown.value = true;
		header.classList.remove(scrollUp);
		buttontitle.classList.remove(opacity1);
		buttonbg.classList.remove(opacity1);
		title.classList.remove(opacity1);
		hiddentitle.classList.remove(opacity0);
		header.classList.add(scrollDown);
		buttontitle.classList.add(opacity0);
		buttonbg.classList.add(opacity0);
		title.classList.add(opacity0);
		hiddentitle.classList.add(opacity1);
	} else if (
		currentScroll < lastScroll.value &&
		header.classList.contains(scrollDown) &&
		body.scrollTop + body.clientHeight !== body.scrollHeight
	) {
		// up
		isScrollingDown.value = true;
		header.classList.remove(scrollDown);
		buttontitle.classList.remove(opacity0);
		buttonbg.classList.remove(opacity0);
		title.classList.remove(opacity0);
		hiddentitle.classList.remove(opacity1);
		header.classList.add(scrollUp);
		buttontitle.classList.add(opacity1);
		title.classList.add(opacity1);
		hiddentitle.classList.add(opacity0);
	}
	lastScroll.value = currentScroll;
}

onMounted(() => {
	usePostsStore().fetchHomePosts();
	if (window.addEventListener) {
		window.addEventListener('wheel', collapse);
		window.addEventListener('touchmove', collapse);
	}
});
</script>

<template>
	<!-- Header -->
	<div
		id="header"
		class="bg-darkBG dark:bg-lightBG animatefast flex h-56 w-full flex-row items-center rounded-lg shadow-lg"
		:style="{
			background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(${require(`@/assets/images/category/` +
				$route.params.category +
				`/` +
				`header.webp`)})`,
			backgroundSize: 'cover',
		}"
	>
		<div class="flex h-full flex-col justify-between px-4 py-5 xl:px-6">
			<button class="focus:outline-none relative flex" @click="$router.push(`/discover`)">
				<div class="bg-gray1 z-10 flex-shrink-0 rounded-full">
					<BackIcon />
				</div>
				<p
					id="buttontitle"
					class="animatefast pl-3 z-10 pr-4 font-semibold text-lightPrimaryText dark:text-darkPrimaryText"
				>
					All categories
				</p>
				<h2
					id="hiddentitle"
					class="text-lightPrimaryText dark:text-darkPrimaryText animatelong absolute ml-8 -mt-1 px-2 text-xl font-semibold capitalize opacity-0"
				>
					{{ category.replace(`-`, ` `) }}
				</h2>
				<div
					id="buttonbg"
					class="bg-lightBG animatefast absolute h-full rounded-full bg-opacity-50 z-0"
					style="width: 155px"
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
		class="min-h-115 h-115 lg:min-h-150 lg:h-150 w-full overflow-y-auto lg:overflow-y-hidden relative"
	>
		<div v-for="post in posts" :key="`new_${post.post._id}`">
			<SimpleFeedCard :fetched-post="post" />
		</div>
	</article>
</template>
<style>
.animatefast {
	transition: all 0.4s;
}
.animatelong {
	transition: all 0.6s;
	z-index: 50;
}
.scrolldown {
	background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%), none !important;
	height: 4rem;
}
.scrollup {
	opacity: 1;
	transform: none;
}
.opacity0 {
	opacity: 0;
}
.opacity1 {
	opacity: 1;
}
</style>
