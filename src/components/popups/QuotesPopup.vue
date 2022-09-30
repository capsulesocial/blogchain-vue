<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getReposts, IGetRepostsOptions } from '@/backend/reposts';
import { IRepostResponse } from '@/backend/post';
import { Algorithm } from '@/backend/post';
import QuoteListCard from '@/components/post/QuoteListCard.vue';

import CloseIcon from '@/components/icons/CloseIcon.vue';

const emit = defineEmits([`close`]);

const props = withDefaults(
	defineProps<{
		cid: string;
	}>(),
	{},
);

const isLoading = ref<boolean>(true);
const reposts = ref<IRepostResponse[]>([]);

onMounted(async (): Promise<void> => {
	const options: IGetRepostsOptions = { sort: Algorithm.NEW, offset: 0, limit: 1000, type: `quote` };
	reposts.value = await getReposts({ postCID: props.cid }, options);
	isLoading.value = false;
});
</script>

<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<div
			v-if="props.cid !== null"
			class="popup min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
		>
			<div class="sticky flex items-center justify-between mb-6">
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">Quoted this post</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</div>
			<article v-if="!isLoading">
				<div
					v-for="quote in reposts"
					:key="quote.post._id"
					class="flex flex-col border-b border-lightBorder dark:border-darkBorder my-4"
				>
					<QuoteListCard
						:authorid="quote.repost.authorID"
						:cid="quote.repost._id"
						:timestamp="quote.repost.timestamp"
					/>
				</div>
			</article>
			<p v-if="!isLoading && reposts.length === 0" class="text-sm text-gray5 dark:text-gray3 text-center mt-14">
				None of the reposters quoted this post
			</p>
		</div>
	</div>
</template>
