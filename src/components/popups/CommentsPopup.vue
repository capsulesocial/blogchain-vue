<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { getEncryptionKeys, IGenericPostResponse } from '@/backend/post';
import Comment from '@/components/post/comments/Comment.vue';
import SimplePopupCard from '@/components/post/SimplePopupCard.vue';
import StatsIcon from '@/components/icons/StatsIcon.vue';
import CommentFilter from '@/components/post/comments/CommentFilter.vue';
import CommentEditor from '@/components/post/comments/CommentEditor.vue';
import { useCommentsStore } from '@/store/comments';
import { useStore } from '@/store/session';

const emit = defineEmits([`close`, `stats`, `delete`]);

const props = withDefaults(
	defineProps<{
		fetchedPost: IGenericPostResponse;
	}>(),
	{},
);

const filter = ref(``);
const canComment = ref(true);
const commentsStore = useCommentsStore();
const store = useStore();
const postComments = computed(() => commentsStore.getCommentsOfPost(props.fetchedPost.post._id));
const commentsStats = computed(() => commentsStore.getCommentStats(props.fetchedPost.post._id));

function setFilter(reaction: string) {
	filter.value = reaction;
	// filter comments
}
onMounted(async () => {
	await commentsStore.fetchCommentsOfPost(props.fetchedPost.post._id);
	if (props.fetchedPost.post.encrypted && store.$state.id !== ``) {
		// fetch keys
		const res = await getEncryptionKeys(store.$state.id, props.fetchedPost.post._id);
		if (res.status === `INSUFFICIENT_TIER` || res.status === `NOT_SUBSCRIBED`) {
			canComment.value = false;
		}
	}
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
			<SimplePopupCard :fetched-post="props.fetchedPost" @close="emit(`close`)" @delete="emit(`delete`)" />
			<!-- filters -->
			<div class="flex w-full justify-between px-6 py-5">
				<div class="flex flex-row items-center">
					<span v-if="fetchedPost" class="pr-2 font-semibold dark:text-darkPrimaryText"
						>{{ commentsStats?.total }} {{ commentsStats?.total === 1 ? 'comment' : 'comments' }}</span
					>
					<button class="focus:outline-none ml-2" @click="emit(`stats`)"><StatsIcon /></button>
				</div>
				<CommentFilter :filter="filter" class="modal-animation" @clicked="setFilter" />
			</div>
			<!-- Comment editor -->
			<CommentEditor
				v-if="canComment"
				:comments-count="commentsStats?.total"
				:parentcid="fetchedPost.post._id"
				class="px-6"
			/>
			<!-- Comments -->
			<div v-for="c in postComments" :key="c._id">
				<Comment
					:cid="c._id"
					:authorid="c.authorID"
					:timestamp="c.timestamp"
					:emotion="c.emotion"
					:parentcid="c.parentCID"
					:parentauthorid="fetchedPost.post.authorID"
					class="px-6 mb-4"
				/>
			</div>
		</div>
	</div>
</template>
