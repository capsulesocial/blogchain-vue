<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { useStore } from '@/store/session';
import { categories } from '@/config/config';

const settings = useStoreSettings();
const store = useStore();
const categoryList = categories;

const activeFilter = ref<string>(``);

function setFilter(categorie: string) {
	if (store.$state.id === ``) {
		return;
	}
	activeFilter.value = categorie;
	// TODO refetch post with activeFilter
}
</script>

<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4 relative overflow-y-auto"
		style="min-height: calc(80vh - 160px); height: calc(80vh - 160px)"
	>
		<div class="flex flex-row items-center justify-between pb-4">
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">Filter by Category</h6>
			<button v-if="activeFilter !== ``" class="focus:outline-none text-primary pr-1 text-sm" @click="setFilter(``)">
				Clear
			</button>
		</div>
		<button
			v-for="categorie in categoryList"
			:key="categorie"
			class="focus:outline-none flex w-full items-center pb-2 capitalize"
			:to="`/bookmarks/` + categorie"
			@click="setFilter(categorie)"
		>
			<img
				:src="
					settings.isDarkMode
						? require(`@/assets/images/category/` + categorie + `/dark/icon.webp`)
						: require(`@/assets/images/category/` + categorie + `/light/icon.webp`)
				"
				class="hotzone mr-1 h-8 w-8"
			/>
			<span
				class="ml-2"
				:class="activeFilter === categorie ? ' font-semibold text-primary' : ' text-gray5 dark:text-gray3'"
			>
				{{ categorie.replace(`-`, ` `) }}</span
			>
		</button>
	</div>
</template>
