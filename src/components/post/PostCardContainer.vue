<script setup lang="ts">
import SimpleCard from '@/components/post/SimpleCard.vue';
import CommentsContainer from '@/components/post/CommentsContainer.vue';
import { IGenericPostResponse } from '@/backend/post';
import { PropType, ref } from 'vue';

const showComments = ref<boolean>(false);
const toggleComments = () => {
	showComments.value = !showComments.value;
};
const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});
</script>
<template>
	<SimpleCard :fetched-post="props.fetchedPost" :show-comments="showComments" @toggle-comments="toggleComments" />
	<Teleport v-if="showComments" to="body">
		<!-- Popup -->
		<div
			class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="showComments = false"
		>
			<!-- Inner card area -->
			<div
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<SimpleCard
					:fetched-post="props.fetchedPost"
					:show-comments="showComments"
					:hide-actions="showComments"
					@toggle-comments="toggleComments"
				/>
				<CommentsContainer v-if="showComments" />
			</div>
		</div>
	</Teleport>
</template>
