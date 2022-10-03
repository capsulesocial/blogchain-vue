<script setup lang="ts">
import Comment from '@/components/post/comments/Comment.vue';
import { computed, onMounted } from 'vue';
import { useCommentsStore } from '@/store/comments';
import { useRoute } from 'vue-router';

const commentsStore = useCommentsStore();
const route = useRoute();
const authorID = computed(() => route.params.id as string);
const comments = computed(() => commentsStore.getCommentsOfAuthor(authorID.value));
onMounted(() => {
	commentsStore.fetchCommentsOfAuthor(authorID.value);
});
</script>

<template>
	<div
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full px-4"
	>
		<div v-for="c in comments" :key="c"><Comment :cid="c" :authorid="authorID" class="mb-4" /></div>
	</div>
</template>
