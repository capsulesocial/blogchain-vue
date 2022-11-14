<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { usePostsStore } from '@/store/posts';

import TagCard from '@/components/TagCard.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';

import { Timeframe, readableTimeframe } from '@/backend/post';

const settings = useStoreSettings();
const postsStore = usePostsStore();

const tags = ref<string[]>([]);
const showAlgorithmDropdown = ref(false);
const timeFrames = [Timeframe.WEEK, Timeframe.MONTH, Timeframe.YEAR, Timeframe.ALL_TIME];
const selectedTimeframe = ref(Timeframe.MONTH);

async function handleTagFeed(timeframe: Timeframe) {
	if (!timeframe) {
		return;
	}
	selectedTimeframe.value = timeframe;
	const trendingTags = await postsStore.retrieveTags(timeframe);
	if (trendingTags) {
		tags.value = trendingTags;
	}
}
window.addEventListener(`click`, (e: Event) => {
	if (!showAlgorithmDropdown.value) {
		return;
	}
	showAlgorithmDropdown.value = false;
});

onMounted(async () => {
	handleTagFeed(Timeframe.MONTH);
});
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg">
		<div class="flex justify-between items-center relative modal-animation lg:pr-6">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2 px-6 pt-4">
				Trending topics
			</h3>
			<button
				id="filter"
				class="toggle focus:outline-none lg:ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 text-sm shadow-lg dark:text-gray3 mt-2"
				@click.stop="showAlgorithmDropdown = !showAlgorithmDropdown"
			>
				<span class="toggle font-bold capitalize pl-4">
					{{ readableTimeframe(selectedTimeframe) }}
				</span>
				<ChevronUp v-if="showAlgorithmDropdown" class="toggle pr-4" />
				<ChevronDown v-else class="toggle pr-4" />
			</button>
			<div
				v-if="showAlgorithmDropdown"
				class="hotzone border-lightBorder modal-animation absolute top-0 right-0 z-20 rounded-lg border bg-lightBG dark:bg-darkBG px-4 py-3 shadow-lg mr-0 lg:mr-6"
				style="margin-top: 43px"
			>
				<div
					v-for="timeframe in timeFrames"
					:key="timeframe"
					class="hotzone flex justify-start items-start flex-col dark:text-gray3"
				>
					<button
						:class="selectedTimeframe === timeframe ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
						class="hotzone focus:outline-none my-1 px-2 whitespace-nowrap"
						@click="handleTagFeed(timeframe)"
					>
						{{ readableTimeframe(timeframe) }}
					</button>
				</div>
			</div>
		</div>
		<div class="px-6 pb-4">
			<p v-if="tags.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no trending topics are available at the moment </span>
			</p>
			<TagCard v-for="t in tags" v-else :key="t" :tag="t" :no-click="false" class="my-2 mr-4 text-lg" />
		</div>
		<img
			v-if="$route.name === `Discover` || $route.name === `Category` || $route.name === `Tag`"
			v-lazy="{
				src: settings.isDarkMode
					? require(`@/assets/images/brand/dark/discover.webp`)
					: require(`@/assets/images/brand/light/discover.webp`),
			}"
			class="rounded-lg"
		/>
	</div>
</template>
