<script setup lang="ts">
import Comment from '@/components/post/comments/Comment.vue';
import { computed, onMounted, ref } from 'vue';
import { useCommentsStore } from '@/store/comments';
import { useRoute } from 'vue-router';

const commentsStore = useCommentsStore();
const route = useRoute();
const authorID = computed(() => {
	const id = route.params.id;
	if (Array.isArray(id)) {
		throw new Error("The route.params.id shouldn't be an array!");
	}
	return id;
});
const comments = computed(() => commentsStore.getCommentsOfAuthor(authorID.value));
const isLoading = ref<boolean>(false);
const offset = ref<number>(0);
const limit = ref<number>(10);
const noMoreComments = ref<boolean>(false);

function fetchContent() {
	if (isLoading.value) {
		return;
	}
	isLoading.value = true;
	commentsStore.fetchCommentsOfAuthor(authorID.value, offset.value).then((res) => {
		if (res && res.length < limit.value) {
			noMoreComments.value = true;
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

onMounted(() => {
	fetchContent();
	// scrolling event handler
	window.addEventListener('wheel', handleScroll);
	window.addEventListener('touchmove', handleScroll);
});
</script>

<template>
	<div
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full px-4"
	>
		<div v-for="c in comments" :key="c">
			<Comment :cid="c" :authorid="authorID" class="mb-4" />
		</div>
		<p v-if="noMoreComments" class="text-gray5 dark:text-gray3 py-5 text-center text-sm">No more comments</p>
	</div>
</template>
