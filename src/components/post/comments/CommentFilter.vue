<script setup lang="ts">
import { ref } from 'vue';
import { feelings } from '@/config/config';
import { faces } from '@/config/faces';
import { useStoreSettings } from '@/store/settings';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';

const emit = defineEmits([`clicked`]);

const props = withDefaults(
	defineProps<{
		filter: string;
	}>(),
	{},
);

const settings = useStoreSettings();
const showFilter = ref<boolean>(false);
const feeling = ref<`positive` | `negative` | `neutral`>(`positive`);

function setCommentFilterFeeling(input: `positive` | `negative` | `neutral`) {
	feeling.value = input;
	emit(`clicked`, input);
}
function updateFilter(input: string) {
	emit(`clicked`, input);
	showFilter.value = false;
}
function clearFilter() {
	emit(`clicked`, ``);
	showFilter.value = false;
}
</script>

<template>
	<div class="relative flex flex-grow items-center flex-row-reverse">
		<!-- Comment filter -->
		<div class="flex w-full flex-row items-center justify-end">
			<h6 class="hidden xl:block text-gray5 dark:text-gray3">Filter by:</h6>
			<button
				class="toggle focus:outline-none ml-4 flex w-32 items-center justify-between rounded-lg border dark:border-gray3 px-4 text-sm shadow-lg dark:text-gray3"
				@click.stop="showFilter = !showFilter"
			>
				<span v-if="props.filter === ``" class="toggle font-bold">All</span>
				<span v-else class="toggle font-bold capitalize">{{ props.filter }}</span>
				<ChevronUp v-if="showFilter" />
				<ChevronDown v-else />
			</button>
			<button v-show="props.filter !== ``" @click="clearFilter()">
				<span class="ml-2 text-sm text-primary">Clear</span>
			</button>
		</div>
		<!-- comment filter dropdown -->
		<div
			v-show="showFilter"
			class="hotzone border-lightBorder modal-animation absolute w-327 xl:w-full top-0 z-20 rounded-lg border bg-lightBG dark:bg-darkBG p-4 shadow-lg"
			style="margin-top: 28px"
		>
			<!-- Select charge of reaction button -->
			<div class="hotzone mb-6 flex justify-start flex-row text-gray5 dark:text-gray3">
				<button
					class="hotzone focus:outline-none mr-4"
					:class="feeling === `positive` ? `text-positive font-semibold` : ``"
					@click="setCommentFilterFeeling(`positive`)"
				>
					Positive
				</button>
				<button
					class="hotzone focus:outline-none mr-4"
					:class="feeling === `neutral` ? `text-neutral font-semibold` : ``"
					@click="setCommentFilterFeeling(`neutral`)"
				>
					Neutral
				</button>
				<button
					class="hotzone focus:outline-none mr-4"
					:class="feeling === `negative` ? ` text-negative font-semibold` : ``"
					@click="setCommentFilterFeeling(`negative`)"
				>
					Negative
				</button>
			</div>
			<!-- Show faces -->
			<div
				class="faces grid grid-cols-3 gap-x-1 gap-y-4 overflow-y-auto overflow-x-hidden xl:grid-cols-5"
				style="height: 225px; padding-right: 5px"
			>
				<button
					v-for="r in feelings[feeling]"
					:key="r.indexOf"
					class="tooltip focus:outline-none border-lightBorder relative inline-block h-24 w-24 transform rounded-xl border transition duration-500 ease-in-out hover:scale-105 mb-4"
				>
					<img
						:src="settings.isDarkMode ? faces[r].dark : faces[r].light"
						:alt="faces[r].label"
						class="h-24 w-24 flex-shrink-0"
						@click="updateFilter(faces[r].label)"
					/>
					<span class="tooltiptext -mt-2 w-16 bg-white bg-opacity-75 text-center text-xs text-gray5">{{
						faces[r].label
					}}</span>
				</button>
			</div>
		</div>
	</div>
</template>
