<script setup lang="ts">
import { ref } from 'vue';
import { categories } from '@/config/config';
import CategoryCard from '@/components/CategoryCard.vue';

const categoryList = ref<string[]>(categories);
</script>

<template>
	<div class="px-5 pb-2 pt-3 xl:px-6 xl:pt-4">
		<h2 class="text-lightPrimaryText dark:text-darkPrimaryText mb-1 text-lg font-semibold xl:text-xl">
			Featured Categories
		</h2>
		<p class="text-gray5 dark:text-gray3">Read more of what you love by browsing top categories:</p>
	</div>
	<article
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full flex flex-wrap px-4"
	>
		<CategoryCard v-for="c in categoryList" :key="c" :text="c" :bg-image="c" />
		<div class="h-10 w-full"></div>
	</article>
</template>
