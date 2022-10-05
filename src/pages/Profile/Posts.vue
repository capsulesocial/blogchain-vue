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

const isLoading = ref<boolean>(false);
const offset = ref<number>(0);
const limit = ref<number>(10);
const noMorePosts = ref<boolean>(false);

function fetchContent() {
	if (isLoading.value) {
		return;
	}
	isLoading.value = true;
	usePostsStore()
		.fetchProfilePosts(authorID.value, offset.value)
		.then((res) => {
			if (res && res.length < limit.value) {
				noMorePosts.value = true;
			}
			offset.value += limit.value;
			isLoading.value = false;
		});
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
	</div>
</template>
