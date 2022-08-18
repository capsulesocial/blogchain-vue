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
			class="min-h-170 h-170 xl:min-h-240 xl:h-240 box-border grid w-full grid-cols-1 gap-4 overflow-y-auto px-6 pb-8 pt-4 xl:grid-cols-2"
		>
			<CategoryCard v-for="c in categoryList" :key="c" :text="c" :bg-image="c" />
		</article>
	</div>
</template>
