<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { categories } from '@/config/config';
import CategoryCard from '@/components/CategoryCard.vue';
import { getTags } from '@/backend/post';

const categoryList = ref<string[]>(categories);
const tags = ref<string[]>([]);
const showFilter = ref<boolean>(false);

function handleDropdown(e: any): void {
	if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
		return;
	}
	if (!e.target.parentNode.classList.contains(`toggle`)) {
		showFilter.value = false;
	}
}

onMounted(async () => {
	const content = await getTags();
	tags.value = content.slice(0, 14);
	window.addEventListener(`click`, handleDropdown, false);
});

onUnmounted(() => {
	window.removeEventListener(`click`, handleDropdown);
});
</script>

<template>
	<div class="min-h-61 h-61 xl:min-h-160 xl:h-160 border-lightBorder w-full border">
		<div class="px-5 pb-2 pt-3 xl:px-6 xl:pt-4">
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText mb-1 text-lg font-semibold xl:text-xl">
				Featured Categories
			</h2>
			<p class="text-gray5 dark:text-gray3">Read more of what you love by browsing top categories:</p>
		</div>
		<article
			id="scrollable_content"
			class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full grid grid-cols-2 gap-4 px-6 pb-8 pt-4"
		>
			<CategoryCard v-for="c in categoryList" :key="c" :text="c" :bg-image="c" class="w-full" />
		</article>
	</div>
</template>
