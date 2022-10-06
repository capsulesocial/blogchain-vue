<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
// import { storeToRefs } from 'pinia';
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import { usePostsStore } from '@/store/posts';

const postsStore = usePostsStore();
const route = useRoute();
const authorID = computed(() => {
	if (typeof route.params.id !== `string`) {
		throw new Error('route.params.id should not be an array!');
	}
	return route.params.id;
});
const posts = computed(() => postsStore.getProfilePosts(authorID.value));

const isLoading = ref(false);
const offset = ref(0);
const limit = ref(10);
const noMorePosts = ref(false);

async function fetchContent() {
	if (isLoading.value) {
		return;
	}
	isLoading.value = true;

	const res = await usePostsStore().fetchProfilePosts(authorID.value, offset.value);

	if (res && res.length < limit.value) {
		noMorePosts.value = true;
	}
	offset.value += limit.value;
	isLoading.value = false;
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

onBeforeMount(() => {
	fetchContent();
});
onMounted(() => {
	usePostsStore().getProfilePosts(authorID.value);
	// scrolling event handler
	window.addEventListener('wheel', handleScroll);
	window.addEventListener('touchmove', handleScroll);
});
</script>

<template>
	<div
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full"
	>
		<div v-for="post in posts" :key="`new_${post}`">
			<PostCardContainer :fetched-post="postsStore.getPost(post)" />
		</div>
		<p v-if="noMorePosts && posts && posts.length !== 0" class="text-gray5 dark:text-gray3 py-5 text-center text-sm">
			No more posts
		</p>
		<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</div>
	</div>
</template>
