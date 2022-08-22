<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue';
import { BookmarkSort } from '@/backend/bookmarks';
import ChevronUp from './icons/ChevronUp.vue';
import ChevronDown from './icons/ChevronDown.vue';

const showFilter = ref<boolean>(false);

const props = defineProps({
	filter: { type: String, default: `BOOKMARK_DESC` },
});

const emit = defineEmits([`clicked`]);

const { filter } = toRefs(props);

function updateSort(sort: BookmarkSort) {
	// When a user selects a filter
	emit(`clicked`, sort);
	showFilter.value = false;
}

onMounted(() => {
	window.addEventListener(`click`, (e) => {
		if (!e) {
			return;
		}
		if (showFilter.value) {
			showFilter.value = false;
		}
		if (showFilter.value) {
			showFilter.value = false;
		}
	});
});
</script>

<template>
	<div class="relative flex flex-grow items-center flex-row-reverse">
		<!-- bookmarks sort -->
		<div class="toggle flex w-full flex-row items-center justify-end">
			<h6 class="hidden lg:block text-gray5 dark:text-gray3">Sort by:</h6>
			<button
				class="toggle focus:outline-none ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 px-4 text-sm shadow-lg dark:text-gray3"
				@click.stop="showFilter = !showFilter"
			>
				<span v-if="filter === `BOOKMARK_DESC`" class="toggle font-bold capitalize">Date bookmarked</span>
				<span v-if="filter === `POST_DESC`" class="toggle font-bold capitalize">Date posted</span>
				<ChevronUp v-if="showFilter" />
				<ChevronDown v-else />
			</button>
		</div>
		<!-- bookmarks sort dropdown -->
		<div
			v-if="showFilter"
			class="hotzone border-lightBorder modal-animation absolute top-0 z-20 rounded-lg border bg-lightBG dark:bg-darkBG px-4 py-3 shadow-lg"
			style="margin-top: 28px"
		>
			<!-- Select charge of sorting button -->
			<div class="hotzone flex justify-start items-start flex-col dark:text-gray3">
				<button
					class="hotzone focus:outline-none mb-4"
					:class="filter === `BOOKMARK_DESC` ? `text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					@click="updateSort(`BOOKMARK_DESC`)"
				>
					Date bookmarked
				</button>
				<button
					class="hotzone focus:outline-none"
					:class="filter === `POST_DESC` ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					@click="updateSort(`POST_DESC`)"
				>
					Date posted
				</button>
			</div>
		</div>
	</div>
</template>
