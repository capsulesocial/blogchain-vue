<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';
import { useRoute, useRouter } from 'vue-router';

import PostCardContainer from '@/components/post/PostCardContainer.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

import { IRepostResponse, Algorithm } from '@/backend/post';

const store = useStore();
const connectionsStore = useConnectionsStore();
const route = useRoute();
const router = useRouter();

const authorID = computed(() => {
	if (typeof route.params.id !== `string`) {
		throw new Error(`${route.params.id} should be of type string!`);
	}
	return route.params.id;
});
const reposts = ref<IRepostResponse[]>([]);
const isLoading = ref(false);
const currentOffset = ref(0);
const limit = ref(10);
const algorithm = ref(Algorithm.NEW);
const noMorePosts = ref(false);

async function fetchContent() {
	if (isLoading.value || noMorePosts.value) {
		return;
	}
	isLoading.value = true;
	const res = await connectionsStore.fetchReposts(authorID.value, algorithm.value, currentOffset.value, limit.value);
	if (!res) {
		return;
	}
	reposts.value = reposts.value.concat(res);

	if (res.length < limit.value) {
		noMorePosts.value = true;
	}
	currentOffset.value += limit.value;
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

onMounted(async () => {
	await fetchContent();
	// scrolling event handler
	window.addEventListener('wheel', handleScroll);
	window.addEventListener('touchmove', handleScroll);
});
</script>

<template>
	<div id="scrollable_content" class="min-h-88 h-88 overflow-y-auto lg:overflow-y-hidden relative w-full px-4">
		<article v-for="repost in reposts" :key="repost.post._id">
			<PostCardContainer :fetched-post="repost" />
		</article>
		<p v-if="noMorePosts && reposts.length !== 0" class="text-gray5 dark:text-gray3 py-5 mb-36 text-center text-sm">
			No more posts
		</p>
		<article v-show="isLoading" class="flex justify-center">
			<div
				class="loader m-10 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</article>
		<!-- No reposts -->
		<article
			v-if="reposts.length === 0 && !isLoading"
			class="text-gray5 dark:text-gray3 py-5 mb-36 text-center text-sm"
		>
			<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
				<span v-if="authorID === store.$state.id">It seems you haven't reposted any content yet.</span>
				<span v-else>{{ authorID }} hasn't reposted any content yet</span>
			</p>
			<SecondaryButton
				v-if="store.$state.id === authorID"
				:text="`Repost content`"
				:action="() => router.push(`/home`)"
			/>
			<img
				v-if="store.$state.id === authorID"
				:src="require(`@/assets/images/brand/post.webp`)"
				loading="lazy"
				class="top-0 hidden lg:block"
			/>
		</article>
	</div>
</template>
