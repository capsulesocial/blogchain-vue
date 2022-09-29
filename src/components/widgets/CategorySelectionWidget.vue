<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { categories } from '@/config/config';

import ChevronUp from '@/components/icons/ChevronUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';

const settings = useStoreSettings();
const categoryList = categories;
const category = ref<string>(``);
const showCategoryDropdown = ref<boolean>(false);
</script>

<template>
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border px-6 py-4 shadow-lg">
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Category</h6>
		<button
			class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 focus:outline-none my-1 mt-3 w-full rounded-lg p-2"
			@click="showCategoryDropdown = !showCategoryDropdown"
		>
			<div class="flex items-center justify-between">
				<div v-if="category" class="flex flex-row items-center">
					<!-- <img
						:src="
							settings.isDarkMode
								? require(`@/assets/images/category/` + $store.state.draft.drafts[$store.state.draft.activeIndex].category + `/dark/icon.webp`)
								: require(`@/assets/images/category/` + $store.state.draft.drafts[$store.state.draft.activeIndex].category + `/light/icon.webp`)
						"
						class="hotzone mr-1 h-8 w-8"
					/>
					<span class="text-primary dark:text-gray1 text-base capitalize">{{
						$store.state.draft.drafts[$store.state.draft.activeIndex].category.replace(`-`, ` `)
					}}</span> -->
				</div>
				<div v-else class="text-gray5 dark:text-gray3">Select a Category</div>
				<ChevronUp v-if="showCategoryDropdown" />
				<ChevronDown v-else />
			</div>
		</button>
		<div v-show="showCategoryDropdown" class="flex flex-col mt-2">
			<button
				v-for="c in categoryList"
				:key="c"
				class="focus:outline-none modal-animation flex h-10 w-full items-center px-2 capitalize"
			>
				<img
					:src="
						settings.isDarkMode
							? require(`@/assets/images/category/` + c + `/dark/icon.webp`)
							: require(`@/assets/images/category/` + c + `/light/icon.webp`)
					"
					class="hotzone mr-1 h-8 w-8"
				/>
				<span class="ml-2" :class="category === c ? ' font-semibold text-primary' : ' text-gray5 dark:text-gray3'">
					{{ c.replace(`-`, ` `) }}</span
				>
			</button>
		</div>
	</article>
</template>
