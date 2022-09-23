<script setup lang="ts">
import { ref } from 'vue';
import { Post } from '@/backend/post';

withDefaults(
	defineProps<{
		bookmark: Post;
	}>(),
	{},
);

const cid = ref<string>(``);
const featuredPhoto = ref<any>();
const authorName = ref<string>(``);

// IF featuredPhotoCID: fetch featuredPhoto
</script>

<template>
	<router-link :to="`/post/` + cid" class="flex w-full flex-row items-center my-4">
		<!-- Left side: title and author name -->
		<div class="flex flex-grow flex-col">
			<h5 class="font-semibold dark:text-darkSecondaryText">{{ bookmark.title }}</h5>
			<h6 v-if="authorName !== ``" class="text-gray5 dark:text-gray3">By {{ authorName }}</h6>
			<h6 v-else class="text-gray5 dark:text-gray3">By @{{ bookmark.authorID }}</h6>
		</div>
		<!-- Right side: featured photo -->
		<div class="w-24 hidden xl:block">
			<img
				v-if="featuredPhoto !== null"
				v-lazy="{ src: featuredPhoto }"
				:alt="bookmark.title"
				class="h-16 w-full flex-shrink-0 rounded-lg object-cover"
			/>
		</div>
	</router-link>
</template>
