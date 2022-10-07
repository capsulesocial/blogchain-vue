<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { useStore } from '@/store/session';
import { categories } from '@/config/config';
import { usePostsStore } from '@/store/posts';

const settings = useStoreSettings();
const postsStore = usePostsStore();
const store = useStore();
const categoryList = categories;

const activeFilter = ref(postsStore.$state.bookmarksCategory);

function setFilter(category: string | undefined) {
	if (store.$state.id === ``) {
		return;
	}
	activeFilter.value = category;
	// TODO refetch post with activeFilter
	postsStore.setBookmarkCategory(category);
}
</script>

<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4 relative overflow-y-auto"
		style="min-height: calc(70vh - 160px); height: calc(70vh - 160px)"
	>
		<div class="flex flex-row items-center justify-between pb-4">
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">Filter by Category</h6>
			<button v-if="activeFilter" class="focus:outline-none text-primary pr-1 text-sm" @click="setFilter(undefined)">
				Clear
			</button>
		</div>
		<button
			v-for="c in categoryList"
			:key="c"
			class="focus:outline-none flex w-full items-center pb-2 capitalize"
			:to="`/bookmarks/` + c"
			@click="setFilter(c)"
		>
			<img
				:src="
					settings.isDarkMode
						? require(`@/assets/images/category/` + c + `/dark/icon.webp`)
						: require(`@/assets/images/category/` + c + `/light/icon.webp`)
				"
				class="hotzone mr-1 h-8 w-8"
			/>
			<span class="ml-2" :class="activeFilter === c ? ' font-semibold text-primary' : ' text-gray5 dark:text-gray3'">
				{{ c.replace(`-`, ` `) }}</span
			>
		</button>
	</div>
</template>
