<script setup lang="ts">
import { PropType } from 'vue';
import { IGenericPostResponse } from '@/backend/post';
import SimplePopupCard from '@/components/post/SimplePopupCard.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import Stats from '@/components/post/Stats.vue';

const emit = defineEmits([`close`, `comments`]);

const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});
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
			<!-- Back button -->
			<button class="flex items-center px-6 py-5" @click="emit(`comments`)">
				<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
					<ChevronLeft />
				</div>
				<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
					>All comments</span
				>
			</button>
			<!-- Stats -->
			<Stats
				:id="props.fetchedPost.post._id"
				:bookmarkscount="props.fetchedPost.bookmarksCount"
				:repostcount="props.fetchedPost.repostCount"
				class="px-6"
			/>
		</div>
	</div>
</template>
