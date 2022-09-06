<script setup lang="ts">
import SimpleCard from '@/components/post/SimpleCard.vue';
import { IGenericPostResponse } from '@/backend/post';
import { PropType, ref } from 'vue';

const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});

const toggleAction = (a: `` | `comments` | `stats` | `share` | `quote`) => {
	activeAction.value = a;
};
const activeAction = ref<`` | `comments` | `stats` | `share` | `quote`>(``);
</script>
<template>
	<SimpleCard :fetched-post="props.fetchedPost" :active-action="activeAction" @toggle-action="toggleAction" />
	<Teleport v-if="activeAction !== ``" to="body">
		<!-- Popup -->
		<div
			class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="activeAction = ``"
		>
			<!-- Inner card area -->
			<div
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<!-- show comments -->
				<div v-if="activeAction === `comments`">showing comments</div>
				<!-- show share -->
				<div v-if="activeAction === `share`">showing share</div>
				<!-- show stats -->
				<div v-if="activeAction === `stats`">showing stats</div>
				<!-- show quote -->
				<div v-if="activeAction === `quote`">showing quote</div>
			</div>
		</div>
	</Teleport>
</template>
