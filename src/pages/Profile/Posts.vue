<script setup lang="ts">
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '@/store/posts';

const postsStore = usePostsStore();
const posts = storeToRefs(postsStore).posts;
</script>

<template>
	<div
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full"
	>
		<div v-for="post in posts" :key="`new_${post.post._id}`">
			<PostCardContainer :fetched-post="post" />
		</div>
	</div>
</template>
