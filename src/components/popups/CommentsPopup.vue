<script setup lang="ts">
import { PropType } from 'vue';
import { IGenericPostResponse } from '@/backend/post';
import Comment from '@/components/post/Comment.vue';

const emit = defineEmits([`close`]);

const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});
</script>

<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Inner card area -->
		<div
			class="min-h-40 w-full lg:w-748 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
		>
			<!-- TODO PopupCard of the post that we can re-use in stats popup -->
			{{ props.fetchedPost.post.title }}
			<!-- Comments -->
			<div v-for="i in 20" :key="i"><Comment class="mb-4" /></div>
		</div>
	</div>
</template>
