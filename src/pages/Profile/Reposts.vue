<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';
import { useRoute, useRouter } from 'vue-router';

import SimpleFeedCard from '@/components/post/SimpleFeedCard.vue';
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
const isLoading = ref<boolean>(true);
const currentOffset = ref<number>(0);
const limit = ref<number>(10);
const algorithm = ref<Algorithm>(Algorithm.NEW);
const noMorePosts = ref<boolean>(false);

onMounted(async (): Promise<void> => {
	const repost = await connectionsStore.fetchReposts(authorID, algorithm.value, currentOffset.value, limit.value);
	if (repost !== undefined) {
		reposts.value = repost;
		return;
	}
});

// methods
function toggleHomeFeed() {
	router.push(`/home`);
}
</script>

<template>
	<div>
		<section id="scrollable_content" class="px-0">
			<article v-if="reposts.length === 0 && !isLoading" class="mt-24 grid justify-items-center px-10 xl:px-0">
				<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
					<span v-if="route.params.id === store.$state.id">It seems you haven't reposted any content yet.</span>
					<span v-else>{{ $route.params.id }} hasn't reposted any content yet</span>
				</p>
				<SecondaryButton
					v-if="store.$state.id === $route.params.id"
					:text="`Repost content`"
					:action="toggleHomeFeed"
				/>
				<img
					v-if="store.$state.id === $route.params.id"
					:src="require(`@/assets/images/brand/post.webp`)"
					loading="lazy"
					class="top-0 hidden lg:block"
				/>
			</article>
			<article v-for="repost in reposts" :key="repost.post._id">
				<SimpleFeedCard :fetched-post="repost" />
			</article>
			<p v-if="noMorePosts && reposts.length !== 0" class="text-gray5 dark:text-gray3 py-5 text-center text-sm">
				No more posts
			</p>
			<article v-show="isLoading" class="flex justify-center">
				<div
					class="loader m-10 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</article>
		</section>
	</div>
</template>
