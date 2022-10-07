<script setup lang="ts">
import Comment from '@/components/post/comments/Comment.vue';
import { computed, onMounted, ref } from 'vue';
import { useCommentsStore } from '@/store/comments';
import { useStore } from '@/store/session';
import { useRoute, useRouter } from 'vue-router';
import SecondaryButton from '@/components/SecondaryButton.vue';
import { ICommentData } from '@/backend/comment';

const commentsStore = useCommentsStore();
const store = useStore();
const route = useRoute();
const router = useRouter();
const authorID = computed(() => {
	const id = route.params.id;
	if (Array.isArray(id)) {
		throw new Error("The route.params.id shouldn't be an array!");
	}
	return id;
});
const comments = ref<ICommentData[]>([]);
// const comments = computed(() => commentsStore.getCommentsOfAuthor(authorID.value));
const isLoading = ref(false);
const offset = ref(0);
const limit = ref(10);
const noMoreComments = ref(false);

async function fetchContent() {
	if (isLoading.value) {
		return;
	}
	isLoading.value = true;
	const res = await commentsStore.fetchCommentsOfAuthor(authorID.value, offset.value);
	if (res && res.length < limit.value) {
		noMoreComments.value = true;
	}
	offset.value += limit.value;
	isLoading.value = false;
	if (!res) {
		return;
	}
	comments.value = comments.value.concat(res);
}

async function handleScroll() {
	if (noMoreComments.value) {
		return;
	}
	const body = document.getElementById(`scrollable_content`);
	if (!body) {
		return;
	}
	const currentScroll = body.scrollTop;
	// infinite scrolling
	if (currentScroll + body.clientHeight >= body.scrollHeight - 5) {
		await fetchContent();
	}
}

onMounted(async () => {
	await fetchContent();
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
		<div v-for="c in comments" :key="c._id">
			<Comment
				:cid="c._id"
				:authorid="c.authorID"
				:emotion="c.emotion"
				:timestamp="c.timestamp"
				:parentcid="c.parentCID"
				class="mb-4"
			/>
		</div>
		<p v-show="noMoreComments && comments.length > 0" class="text-gray5 dark:text-gray3 py-5 mb-12 text-center text-sm">
			No more comments
		</p>
		<!-- Loading spinner -->
		<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</div>
		<!-- No comments -->
		<div v-if="comments && comments.length === 0 && !isLoading" class="mt-24 grid justify-items-center px-10 xl:px-0">
			<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
				<span v-if="authorID === store.$state.id"> It seems you haven't written any comments yet. </span>
				<span v-else> {{ authorID }} hasn't written any comments yet </span>
			</p>
			<SecondaryButton
				v-if="store.$state.id === authorID"
				:text="`Comment on a post`"
				:action="() => router.push(`/home`)"
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
