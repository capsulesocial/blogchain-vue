<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { storeToRefs } from 'pinia';
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import { usePostsStore } from '@/store/posts';
import { useStore } from '@/store/session';
import SecondaryButton from '@/components/SecondaryButton.vue';

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
const store = useStore();
const router = useRouter();

async function fetchContent() {
	if (isLoading.value || noMorePosts.value) {
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
	<div id="scrollable_content" class="min-h-88 h-88 overflow-y-auto lg:overflow-y-hidden relative w-full">
		<div v-for="post in posts" :key="`new_${post}`">
			<PostCardContainer :fetched-post="postsStore.getPost(post)" />
		</div>
		<p
			v-if="noMorePosts && posts && posts.length !== 0"
			class="text-gray5 dark:text-gray3 py-5 mb-36 text-center text-sm"
		>
			No more posts
		</p>
		<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</div>
		<!-- No comments -->
		<div v-if="posts && posts.length === 0 && !isLoading" class="mt-24 grid justify-items-center px-10 xl:px-0">
			<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
				<span v-if="authorID === store.$state.id"> It seems you haven't written any comments yet. </span>
				<span v-else> {{ authorID }} hasn't written any comments yet </span>
			</p>
			<SecondaryButton
				v-if="store.$state.id === authorID"
				:text="`Write a post`"
				:action="() => router.push(`/write`)"
			/>
			<img
				v-if="store.$state.id === authorID"
				:src="require(`@/assets/images/brand/post.webp`)"
				loading="lazy"
				class="top-0 hidden lg:block"
			/>
		</div>
	</div>
</template>
