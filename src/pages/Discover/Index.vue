<script setup lang="ts">
import { categories } from '@/config/config';
import CategoryCard from '@/components/CategoryCard.vue';
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
		class="min-h-170 h-170 xl:min-h-240 xl:h-240 box-border grid w-full grid-cols-1 gap-4 overflow-y-auto px-6 pb-8 pt-4 xl:grid-cols-2"
	>
		<CategoryCard v-for="category in categories" :key="category" :text="category" :bg-image="category" />
	</article>
</template>
