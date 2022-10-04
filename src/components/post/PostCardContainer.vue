<script setup lang="ts">
import SimpleFeedCard from '@/components/post/SimpleFeedCard.vue';
import { IGenericPostResponse } from '@/backend/post';
import { ref } from 'vue';
import CommentsPopup from '@/components/popups/CommentsPopup.vue';
import SharePopup from '@/components/popups/SharePopup.vue';
import StatsPopup from '@/components/popups/StatsPopup.vue';
import QuotePopup from '../popups/QuotePopup.vue';
import { usePostsStore } from '@/store/posts';
import { handleError } from '@/plugins/toast';
import { useStore } from '@/store/session';

const props = withDefaults(
	defineProps<{
		fetchedPost?: IGenericPostResponse;
	}>(),
	{
		fetchedPost: undefined,
	},
);

const postsStore = usePostsStore();
const store = useStore();

const isDeleted = ref<boolean>(false);
async function deletePost() {
	try {
		await postsStore.removePost(props.fetchedPost.post._id, store.$state.id);
	} catch (err) {
		handleError(err);
	} finally {
		isDeleted.value = true;
		// hide post
	}
}

const toggleAction = (a: `` | `comments` | `stats` | `share` | `quote`) => {
	activeAction.value = a;
};
const activeAction = ref<`` | `comments` | `stats` | `share` | `quote`>(``);
</script>
<template>
	<div v-if="props.fetchedPost && !isDeleted">
		<SimpleFeedCard
			:fetched-post="props.fetchedPost"
			:active-action="activeAction"
			@toggle-action="toggleAction"
			@delete="deletePost"
			@hide="isDeleted = true"
		/>
		<Teleport v-if="activeAction !== ``" to="body">
			<!-- show comments -->
			<div v-if="activeAction === `comments`">
				<CommentsPopup
					:fetched-post="props.fetchedPost"
					@close="activeAction = ``"
					@stats="activeAction = `stats`"
					@delete="deletePost"
				/>
			</div>
			<!-- show share -->
			<div v-if="activeAction === `share`">
				<SharePopup
					:id="props.fetchedPost.post._id"
					:title="props.fetchedPost.post.title"
					:subtitle="props.fetchedPost.post.subtitle"
					:excerpt="props.fetchedPost.post.excerpt"
					:featuredphotocid="props.fetchedPost.post.featuredPhotoCID ? props.fetchedPost.post.featuredPhotoCID : ``"
					:authorid="props.fetchedPost.post.authorID"
					@close="activeAction = ``"
				/>
			</div>
			<!-- show stats -->
			<div v-if="activeAction === `stats`">
				<StatsPopup
					:fetched-post="props.fetchedPost"
					@close="activeAction = ``"
					@comments="activeAction = `comments`"
					@delete="deletePost"
				/>
			</div>
			<!-- show quote -->
			<div v-if="activeAction === `quote`">
				<QuotePopup
					:id="props.fetchedPost.post._id"
					:authorid="props.fetchedPost.post.authorID"
					:timestamp="props.fetchedPost.post.timestamp"
					:wordcount="props.fetchedPost.post.wordCount ? props.fetchedPost.post.wordCount : 0"
					:postimages="props.fetchedPost.post.postImages ? props.fetchedPost.post.postImages.length : 0"
					:bookmarked="props.fetchedPost.bookmarked"
					:encrypted="props.fetchedPost.post.encrypted ? props.fetchedPost.post.encrypted : false"
					:title="props.fetchedPost.post.title"
					:subtitle="props.fetchedPost.post.subtitle ? props.fetchedPost.post.subtitle : undefined"
					:excerpt="props.fetchedPost.post.excerpt"
					:featuredphotocid="props.fetchedPost.post.featuredPhotoCID ? props.fetchedPost.post.featuredPhotoCID : ``"
					:tags="props.fetchedPost.post.tags"
					@close="activeAction = ``"
					@delete="deletePost"
				/>
			</div>
		</Teleport>
	</div>
</template>
