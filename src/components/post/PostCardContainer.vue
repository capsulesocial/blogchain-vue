<script setup lang="ts">
import SimpleFeedCard from '@/components/post/SimpleFeedCard.vue';
import { IGenericPostResponse } from '@/backend/post';
import { PropType, ref } from 'vue';
import CommentsPopup from '@/components/popups/CommentsPopup.vue';
import SharePopup from '@/components/popups/SharePopup.vue';
import StatsPopup from '@/components/popups/StatsPopup.vue';
import QuotePopup from '../popups/QuotePopup.vue';

const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});

const toggleAction = (a: `` | `comments` | `stats` | `share` | `quote`) => {
	activeAction.value = a;
};
const activeAction = ref<`` | `comments` | `stats` | `share` | `quote`>(``);
</script>
<template>
	<SimpleFeedCard :fetched-post="props.fetchedPost" :active-action="activeAction" @toggle-action="toggleAction" />
	<Teleport v-if="activeAction !== ``" to="body">
		<!-- show comments -->
		<div v-if="activeAction === `comments`">
			<CommentsPopup :fetched-post="props.fetchedPost" @close="activeAction = ``" @stats="activeAction = `stats`" />
		</div>
		<!-- show share -->
		<div v-if="activeAction === `share`">
			<SharePopup :fetched-post="props.fetchedPost" @close="activeAction = ``" />
		</div>
		<!-- show stats -->
		<div v-if="activeAction === `stats`">
			<StatsPopup :fetched-post="props.fetchedPost" @close="activeAction = ``" @comments="activeAction = `comments`" />
		</div>
		<!-- show quote -->
		<div v-if="activeAction === `quote`">
			<QuotePopup :fetched-post="props.fetchedPost" @close="activeAction = ``" />
		</div>
	</Teleport>
</template>
