<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import TagCard from '@/components/TagCard.vue';

const settings = useStoreSettings();

// TODO: fetch tags from store / backend
const tags = ref([`test`]);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2 px-6 pt-4">
			Trending topics
		</h3>
		<div class="px-6 pb-4">
			<p v-if="tags.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no trending topics are available at the moment </span>
			</p>
			<TagCard v-for="t in tags" v-else :key="t" :tag="t" class="my-2 mr-4 text-lg" />
		</div>
		<img
			v-if="$route.name === `Discover`"
			v-lazy="{
				src: settings.isDarkMode
					? require(`@/assets/images/brand/dark/discover.webp`)
					: require(`@/assets/images/brand/light/discover.webp`),
			}"
			class="rounded-lg"
		/>
	</div>
</template>
