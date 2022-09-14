<script setup lang="ts">
import { PropType, ref } from 'vue';
import { IGenericPostResponse } from '@/backend/post';
import Comment from '@/components/post/Comment.vue';
import SimplePopupCard from '@/components/post/SimplePopupCard.vue';
import StatsIcon from '@/components/icons/StatsIcon.vue';
import CommentFilter from '@/components/post/CommentFilter.vue';

const emit = defineEmits([`close`, `stats`]);

const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});

const filter = ref<string>(``);

function setFilter(reaction: string): void {
	filter.value = reaction;
	// filter comments
}
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Inner card area -->
		<div
			class="popup min-h-40 w-full lg:w-748 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg shadow-lg"
		>
			<!-- popup header with post summary -->
			<SimplePopupCard :fetched-post="props.fetchedPost" @close="emit(`close`)" />
			<!-- filters -->
			<div class="flex w-full justify-between px-6 py-5">
				<div class="flex flex-row items-center">
					<span class="pr-2 font-semibold dark:text-darkPrimaryText"
						>{{ fetchedPost.commentsCount }} {{ fetchedPost.commentsCount === 1 ? 'comment' : 'comments' }}</span
					>
					<button class="focus:outline-none ml-2" @click="emit(`stats`)"><StatsIcon /></button>
				</div>
				<CommentFilter :filter="filter" class="modal-animation" @clicked="setFilter" />
			</div>
			<!-- Comments -->
			<div v-for="i in 20" :key="i"><Comment class="px-6 mb-4" /></div>
		</div>
	</div>
</template>
