<script setup lang="ts">
import { PropType, ref } from 'vue';
import { IGenericPostResponse } from '@/backend/post';
import { useStoreSettings } from '@/store/settings';
import { ICommentsStats, getCommentsStats } from '@/backend/comment';
import { IFace, faces } from '@/config/faces';
import { feelings } from '@/config/config';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import RepostIcon from '@/components/icons/RepostIcon.vue';
import QuoteIcon from '@/components/icons/QuoteIcon.vue';

interface FaceStat {
	face: IFace;
	count: number;
}

const settings = useStoreSettings();
const commentsStats = ref<ICommentsStats>({
	total: 0,
	positive: 0,
	neutral: 0,
	negative: 0,
	faceStats: {},
});
const faceStats = ref<FaceStat[]>([]);
const page = ref<number>(0);

// const emit = defineEmits([`close`]);

const props = defineProps({
	fetchedPost: { type: Object as PropType<IGenericPostResponse>, required: true },
});

function getStyle(emotionType: string): string {
	if (feelings.positive.has(emotionType)) {
		return `positive`;
	}
	if (feelings.negative.has(emotionType)) {
		return `negative`;
	}

	return `neutral`;
}

async function updateCommentsStats() {
	commentsStats.value = await getCommentsStats(props.fetchedPost.post._id);
	const { faceStats } = commentsStats.value;
	const stats: Record<string, FaceStat> = {};

	for (const face in faceStats) {
		if (!(face in faces)) {
			continue;
		}
		const f = faces[face];
		stats[f.label] = { face: f, count: faceStats[face] };
	}
	// faceStats.value = sortBy(Object.values(stats), `count`);
}

updateCommentsStats();
</script>
<template>
	<!-- container -->
	<div class="px-6 pb-6">
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
						<h2 class="text-2xl font-semibold">{{ props.fetchedPost.bookmarksCount }}</h2>
						<span class="text-sm">Bookmarks</span>
					</div>
					<!-- Reposts count -->
					<div class="flex flex-col">
						<h2 class="text-2xl font-semibold">{{ props.fetchedPost.repostCount }}</h2>
						<span class="text-sm">Reposts</span>
					</div>
				</div>
			</div>
			<div v-if="props.fetchedPost.repostCount > 0" class="flex flex-col w-2/5 lg:w-1/5">
				<!-- Show reposters and quotes -->
				<button class="text-sm text-primary h-fit flex items-center">
					<RepostIcon :is-active="true" :shrink="true" class="mr-2 p-1" />
					<p>See reposters</p>
				</button>
				<button class="text-sm text-primary h-fit flex items-center mt-2">
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
					<div v-for="f in faceStats.slice(page * 6, page * 6 + 6)" :key="f.face.label" class="flex w-24 flex-col">
						<div class="flex flex-col rounded-lg border p-1" :class="`border-` + getStyle(f.face.label)">
							<span class="self-center text-xs dark:text-darkPrimaryText">{{ f.face.label.replace(/_/g, ' ') }}</span>
							<img
								:src="settings.isDarkMode ? f.face.dark : f.face.light"
								:alt="f.face.label"
								class="h-16 w-16 self-center mt-1"
							/>
						</div>
						<span class="mt-1 self-center text-sm font-semibold dark:text-darkPrimaryText"
							>{{ ((f.count / commentsStats.total) * 100).toFixed(1) }}%</span
						>
					</div>
				</div>
				<button
					v-show="6 * page + 6 < faceStats.length"
					class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full"
					@click="page = page + 1"
				>
					<ChevronRight />
				</button>
			</div>
		</div>
	</div>
</template>