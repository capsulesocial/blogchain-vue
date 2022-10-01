<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useCommentsStore } from '@/store/comments';

import Comment from '@/components/post/comments/Comment.vue';
import { ICommentData } from '@/backend/comment';

const route = useRoute();
const commentStore = useCommentsStore();

const userComments = ref<ICommentData[]>();
const commentsOffset = ref<number>(0);
const commentLimit = ref<number>(10);
const profileID = ref<string>(route.params.id as string);

onBeforeMount(async () => {
	const res = await commentStore.fetchUserComments(profileID.value, commentsOffset.value, commentLimit.value);
	userComments.value = res;
	console.log(res);
});
</script>

<template>
	<div
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full px-4"
	>
		<div v-for="userComment in userComments" :key="userComment._id">
			<Comment :post-comment="userComment" :cid="userComment._id" class="mb-4" />
		</div>
	</div>
</template>
