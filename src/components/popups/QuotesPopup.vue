<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getReposts, IGetRepostsOptions } from '@/backend/reposts';
import { createDefaultProfile, getProfile } from '@/backend/profile';
import { getRegularPost } from '@/backend/post';
import { Algorithm } from '@/backend/post';
import { formatDate } from '@/helpers/helpers';

import CloseIcon from '@/components/icons/CloseIcon.vue';

const emit = defineEmits([`close`]);

const props = withDefaults(
	defineProps<{
		cid: string;
	}>(),
	{},
);

const isLoading = ref<boolean>(true);
const quoteReposts = ref<Array<any>>([]);

async function getReposterProfile(p: string) {
	let profile = createDefaultProfile(p);
	let avatar = ``;
	await getProfile(p).then((fetchedProfile) => {
		if (fetchedProfile.profile) {
			profile = fetchedProfile.profile;
		}
		if (profile.avatar !== ``) {
			avatar = profile.avatar;
		}
	});
	return { profile, avatar };
}

async function fetchQuote(cid: string, authorID: string) {
	const { data: content } = await getRegularPost(cid);
	const { profile, avatar } = await getReposterProfile(authorID);
	const q = {
		content: content.content,
		timestamp: content.timestamp,
		authorID: content.authorID,
		name: profile.name,
		avatar,
	};
	quoteReposts.value.push(q);
}

async function getQuoteReposts() {
	const options: IGetRepostsOptions = { sort: Algorithm.NEW, offset: 0, limit: 1000, type: `quote` };
	const reposts = await getReposts({ postCID: props.cid }, options);
	reposts.forEach((repost) => {
		fetchQuote(repost.repost._id, repost.repost.authorID);
	});
	isLoading.value = false;
}

onMounted(async (): Promise<void> => {
	await getQuoteReposts();
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
				<div v-for="quote in quoteReposts" :key="quote.authorID + quote.timestamp" class="flex flex-col">
					<div class="flex items-center">
						<Avatar :authorid="quote.authorID" :cid="quote.avatar" size="w-12 h-12" />
						<div class="h-12 flex flex-col px-4">
							<nuxt-link :to="`/id/` + quote.authorID" class="flex items-center">
								<span
									v-if="quote.name != ``"
									class="text-base font-medium text-lightPrimaryText dark:text-darkPrimaryText"
								>
									{{ quote.name }}
								</span>
								<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ quote.authorID }} </span>
								<span class="text-gray5 dark:text-gray3 text-sm ml-2">@{{ quote.authorID }}</span>
							</nuxt-link>
							<span class="mt-1 text-xs text-gray5 dark:text-gray3">{{ formatDate(quote.timestamp) }}</span>
						</div>
					</div>
					<div
						class="my-4 pb-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
					>
						{{ quote.content }}
					</div>
				</div>
			</article>
			<p v-if="!isLoading && quoteReposts.length === 0" class="text-sm text-gray5 dark:text-gray3 text-center mt-14">
				None of the reposters quoted this post
			</p>
		</div>
	</div>
</template>
