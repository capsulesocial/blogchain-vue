<script setup lang="ts">
import { computed } from 'vue';
import { usePostsStore } from '@/store/posts';
import { useProfilesStore } from '@/store/profiles';
import IpfsImage from '@/components/IpfsImage.vue';

const props = defineProps<{
	cid: string;
}>();

const postsStore = usePostsStore();
const profileStore = useProfilesStore();
const bookmark = computed(() => postsStore.getPost(props.cid));
const author = computed(() => {
	if (!bookmark.value) {
		return;
	}
	return profileStore.getProfile(bookmark.value?.post.authorID);
});
</script>

<template>
	<div v-if="bookmark">
		<router-link :to="`/post/` + cid" class="flex w-full flex-row items-center my-4">
			<!-- Left side: title and author name -->
			<div class="flex flex-grow flex-col">
				<h5 class="font-semibold dark:text-darkSecondaryText">{{ bookmark.post.title }}</h5>
				<h6 v-if="author?.name !== ``" class="text-gray5 dark:text-gray3">By {{ author?.name }}</h6>
				<h6 v-else class="text-gray5 dark:text-gray3">By @{{ author.id }}</h6>
			</div>
			<!-- Right side: featured photo -->
			<div
				v-if="bookmark.post.featuredPhotoCID"
				class="w-24 h-16 object-contain overflow-hidden rounded-lg hidden xl:block"
			>
				<IpfsImage :cid="bookmark.post.featuredPhotoCID" :img-class="`h-16 w-full flex-shrink-0 rounded-lg`" />
			</div>
		</router-link>
	</div>
</template>
