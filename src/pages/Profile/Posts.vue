<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import { storeToRefs } from 'pinia';
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import { usePostsStore } from '@/store/posts';

const postsStore = usePostsStore();
const route = useRoute();
const authorID = computed(() => route.params.id as string);
const posts = computed(() => postsStore.getProfilePosts(authorID.value));

onBeforeMount(() => {
	usePostsStore().fetchProfilePosts(authorID.value);
});
onMounted(() => {
	usePostsStore().getProfilePosts(authorID.value);
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
