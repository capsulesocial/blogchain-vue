<script setup lang="ts">
import SimpleCard from '@/components/post/SimpleCard.vue';
import { IGenericPostResponse } from '@/backend/post';
import { PropType, ref } from 'vue';
import CommentsPopup from '@/components/popups/CommentsPopup.vue';
import SharePopup from '@/components/popups/SharePopup.vue';

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
		<!-- show comments -->
		<div v-if="activeAction === `comments`">
			<CommentsPopup :fetched-post="props.fetchedPost" @close="activeAction = ``" />
		</div>
		<!-- show share -->
		<div v-if="activeAction === `share`">
			<SharePopup :fetched-post="props.fetchedPost" @close="activeAction = ``" />
		</div>
		<!-- show stats -->
		<div v-if="activeAction === `stats`">showing stats</div>
		<!-- show quote -->
		<div v-if="activeAction === `quote`">showing quote</div>
	</Teleport>
</template>
