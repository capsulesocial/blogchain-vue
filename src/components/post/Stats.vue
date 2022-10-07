<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { IFaceWithoutDefault, faces } from '@/config/faces';
import { emotionCategories } from '@/config/config';
import RepostersPopup from '@/components/popups/RepostersPopup.vue';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import RepostIcon from '@/components/icons/RepostIcon.vue';
import QuoteIcon from '@/components/icons/QuoteIcon.vue';
import QuotesPopup from '../popups/QuotesPopup.vue';
import { useCommentsStore } from '@/store/comments';

// const emit = defineEmits([`close`]);
const props = withDefaults(
	defineProps<{
		id: string;
		bookmarkscount: number;
		repostcount: number;
	}>(),
	{},
);

interface FaceStat {
	face: IFaceWithoutDefault;
	count: number;
}

const settings = useStoreSettings();
const commentsStore = useCommentsStore();
const facePercentage = ref<FaceStat[]>([]);
const page = ref<number>(0);
const showReposters = ref<boolean>(false);
const showQuotes = ref<boolean>(false);
const commentsStats = computed(() => commentsStore.getCommentStats(props.id));

async function updateCommentsStats() {
	await commentsStore.fetchCommentsStats(props.id);
	const faceStats = commentsStats.value?.faceStats;
	const stats: Record<string, FaceStat> = {};

	for (const face in faceStats) {
		if (!(face in faces)) {
			continue;
		}
		const f = faces[face];
		stats[f.label] = { face: f as IFaceWithoutDefault, count: faceStats[face] };
	}
	facePercentage.value = Object.values(stats).sort((a, b) => {
		return a.count - b.count;
	});
}
onBeforeMount(() => {
	updateCommentsStats();
});
</script>
<template>
	<!-- container -->
	<div v-if="commentsStats" class="pb-6">
		<!-- Global Activity -->
		<div class="flex h-32 justify-between items-center border-b pt-5">
			<!-- Stats image -->
			<div class="w-2/5 hidden lg:block">
				<img :src="require(`@/assets/images/brand/stats.webp`)" class="h-28 flex-shrink-0 pl-5" />
			</div>
			<!-- Text stats -->
			<div class="flex w-2/5 flex-col dark:text-darkPrimaryText">
				<h6 class="pb-4 text-sm font-semibold">Global Post Activity</h6>
				<div class="flex flex-row">
					<!-- Bookmarks Count -->
					<div class="flex flex-col pr-5">
						<h2 class="text-2xl font-semibold">{{ props.bookmarkscount }}</h2>
						<span class="text-sm">Bookmarks</span>
					</div>
					<!-- Reposts count -->
					<div class="flex flex-col">
						<h2 class="text-2xl font-semibold">{{ props.repostcount }}</h2>
						<span class="text-sm">Reposts</span>
					</div>
				</div>
			</div>
			<div v-if="props.repostcount > 0" class="flex flex-col w-2/5 lg:w-1/5">
				<!-- Show reposters and quotes -->
				<button class="text-sm text-primary h-fit flex items-center" @click="showReposters = true">
					<RepostIcon :shrink="true" class="mr-2 p-1" />
					<p>See reposters</p>
				</button>
				<button class="text-sm text-primary h-fit flex items-center mt-2" @click="showQuotes = true">
					<QuoteIcon class="mr-2 p-1" />
					<p>See quotes</p>
				</button>
			</div>
			<div v-else class="flex flex-grow">
				<!-- Filler -->
			</div>
		</div>
		<!-- Comments Activity -->
		<div class="flex h-44 justify-between">
			<!-- Graph breakdown -->
			<div
				v-if="commentsStats.positive + commentsStats.neutral + commentsStats.negative !== 0"
				class="ml-5 pt-4 hidden h-full flex-row self-end lg:flex"
			>
				<!-- Positive -->
				<span
					class="bg-positive w-6 self-end rounded-t-full"
					:style="`height: ` + (commentsStats.positive / commentsStats.total) * 100 + `%`"
				></span>
				<!-- Neutral -->
				<span
					class="bg-neutral mx-2 w-6 self-end rounded-t-full"
					:style="`height: ` + (commentsStats.neutral / commentsStats.total) * 100 + `%`"
				></span>
				<!-- Negative -->
				<span
					class="bg-negative w-6 self-end rounded-t-full"
					:style="`height: ` + (commentsStats.negative / commentsStats.total) * 100 + `%`"
				></span>
			</div>
			<div
				v-else
				class="ml-5 pt-4 hidden h-full flex-row self-end items-center lg:flex text-sm text-gray5 dark:text-gray3"
			>
				no comments
			</div>
			<!-- Text stats -->
			<div class="flex w-3/5 flex-col pt-5 dark:text-darkPrimaryText">
				<h6 class="pb-4 text-sm font-semibold">Comment Activity</h6>
				<!-- Bookmarks Count -->
				<div class="mb-2 flex flex-row">
					<div class="flex flex-col pr-4">
						<h2 class="text-2xl font-semibold">{{ commentsStats.total }}</h2>
						<span class="text-sm">Total comments</span>
					</div>
				</div>
				<!-- Type breakdown Count -->
				<div class="flex flex-row">
					<div class="flex flex-col pr-4">
						<h2 class="text-positive text-2xl font-semibold">{{ commentsStats.positive }}</h2>
						<span class="text-sm">Positive</span>
					</div>
					<div class="flex flex-col pr-4">
						<h2 class="text-neutral text-2xl font-semibold">{{ commentsStats.neutral }}</h2>
						<span class="text-sm">Neutral</span>
					</div>
					<div class="flex flex-col pr-4">
						<h2 class="text-negative text-2xl font-semibold">{{ commentsStats.negative }}</h2>
						<span class="text-sm">Negative</span>
					</div>
				</div>
			</div>
		</div>
		<div v-if="commentsStats.total !== 0" class="border-b w-full"></div>
		<!-- Comment Emotions -->
		<div v-if="commentsStats.total !== 0" class="pt-5">
			<h6 class="w-full pb-4 text-center text-sm font-semibold dark:text-darkPrimaryText">Comment Emotions</h6>
			<!-- Row of faces -->
			<div class="flex items-center">
				<button
					v-show="page > 0"
					class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full"
					@click="page = page - 1"
				>
					<ChevronLeft />
				</button>
				<div class="grid w-full grid-cols-3 lg:grid-cols-6">
					<div v-for="f in facePercentage.slice(page * 6, page * 6 + 6)" :key="f.face.label" class="flex w-24 flex-col">
						<div
							class="flex flex-col rounded-lg p-1 bg-opacity-10"
							:class="
								emotionCategories.positive.has(f.face.label)
									? `bg-positive`
									: emotionCategories.negative.has(f.face.label)
									? `bg-negative`
									: `bg-neutral`
							"
						>
							<span class="self-center text-xs dark:text-darkPrimaryText">{{ f.face.label.replace(/_/g, ' ') }}</span>
							<img
								:src="settings.isDarkMode ? f.face.dark : f.face.light"
								:alt="f.face.label"
								class="h-20 w-20 self-center mt-1"
							/>
						</div>
						<span class="mt-1 self-center text-sm font-semibold dark:text-darkPrimaryText"
							>{{ ((f.count / commentsStats.total) * 100).toFixed(1) }}%</span
						>
					</div>
				</div>
				<button
					v-show="6 * page + 6 < facePercentage.length"
					class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full"
					@click="page = page + 1"
				>
					<ChevronRight />
				</button>
			</div>
		</div>
		<Teleport to="body">
			<RepostersPopup v-if="showReposters" :cid="props.id" @close="showReposters = false" />
			<QuotesPopup v-if="showQuotes" :cid="props.id" @close="showQuotes = false" />
		</Teleport>
	</div>
</template>
