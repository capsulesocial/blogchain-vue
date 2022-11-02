<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';
import { usePostsStore } from '@/store/posts';
import BackIcon from '@/components/icons/ChevronLeft.vue';
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

const route = useRoute();
const postsStore = usePostsStore();
const category = computed(() => {
	if (typeof route.params.category === `string`) {
		return route.params.category;
	}

	throw new Error(`route.params.category can't be an array`);
});

const categoryPosts = computed(() => postsStore.getCategoryPosts(category.value));
const lastScroll = ref(0);
const isScrollingDown = ref(false);
const offset = ref(0);
const limit = ref(10);
const isLoading = ref(true);
const noMorePosts = ref(false);

useMeta({
	title: `${category.value.charAt(0).toUpperCase() + category.value.slice(1)} category on Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

function collapse() {
	const body = document.getElementById(`scrollable_content`);
	const buttontitle = document.getElementById(`buttontitle`);
	const buttonbg = document.getElementById(`buttonbg`);
	const title = document.getElementById(`title`);
	const opacity0 = `opacity0`;
	const opacity1 = `opacity1`;
	if (!body || !buttontitle || !buttonbg || !title) {
		return;
	}
	const currentScroll = body.scrollTop;
	if (currentScroll > lastScroll.value) {
		// down
		isScrollingDown.value = true;
		buttontitle.classList.remove(opacity1);
		buttonbg.classList.remove(opacity1);
		title.classList.remove(opacity1);
		buttontitle.classList.add(opacity0);
		buttonbg.classList.add(opacity0);
		title.classList.add(opacity0);
	} else if (currentScroll < lastScroll.value && body.scrollTop + body.clientHeight !== body.scrollHeight) {
		// up
		isScrollingDown.value = false;
		buttontitle.classList.remove(opacity0);
		buttonbg.classList.remove(opacity0);
		title.classList.remove(opacity0);
		buttontitle.classList.add(opacity1);
		title.classList.add(opacity1);
	}
	lastScroll.value = currentScroll;
	if (body.scrollTop + body.clientHeight >= body.scrollHeight - 5 && !isLoading.value && !noMorePosts.value) {
		isLoading.value = true;
		postsStore.fetchDiscoverPosts(category.value, offset.value, limit.value).then((res) => {
			if (res && res.length < limit.value) {
				noMorePosts.value = true;
			}
			offset.value += limit.value;
			isLoading.value = false;
		});
	}
}

onMounted(() => {
	postsStore.fetchDiscoverPosts(category.value, offset.value, limit.value);
	offset.value += limit.value;
	isLoading.value = false;
	if (window.addEventListener) {
		window.addEventListener('wheel', collapse);
		window.addEventListener('touchmove', collapse);
	}
});
</script>

<template>
	<!-- Header -->
	<div
		class="bg-darkBG dark:bg-lightBG animatefast flex w-full flex-row items-center rounded-lg shadow-lg"
		:class="isScrollingDown ? `scrolldown h-16` : `scrollup h-56`"
		:style="{
			background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(${require(`@/assets/images/category/` +
				category +
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
					class="text-lightPrimaryText dark:text-darkPrimaryText animatelong absolute ml-8 -mt-1 px-2 text-xl font-semibold capitalize"
					:class="isScrollingDown ? `opacity-1` : `opacity-0`"
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
		<div v-if="categoryPosts && categoryPosts.length > 0">
			<PostCardContainer v-for="post in categoryPosts" :key="`new_${post}`" :fetched-post="postsStore.getPost(post)" />
		</div>
		<div v-else class="mt-10 grid justify-items-center overflow-y-hidden px-6 xl:px-0">
			<p class="text-gray5 dark:text-gray3 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
				It seems there are no posts under this category yet
			</p>
			<SecondaryButton :text="`All categories`" :action="() => $router.push(`/discover`)" />
		</div>
		<p v-if="noMorePosts && categoryPosts!.length > 0" class="text-gray5 dark:text-gray3 py-5 text-center text-sm">
			No more posts
		</p>
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
