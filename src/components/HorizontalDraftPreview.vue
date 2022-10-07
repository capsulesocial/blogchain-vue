<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { Post } from '@/backend/post';
import { formatDate } from '@/helpers/helpers';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import ImageIcon from '@/components/icons/ImageIcon.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import BinIcon from '@/components/icons/BinIcon.vue';

type DraftPost = Omit<Post, `authorID`>;

defineProps<{
	draft: DraftPost;
}>();

const settings = useStoreSettings();
const featuredPhoto = ref<any>();
const inWidget = ref(true);
const showDelete = ref(false);

function setActiveDraft(draft: DraftPost) {
	return;
}

function deleteDraft(draft: DraftPost) {
	return;
}

function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}

// IF featuredPhotoCID: fetch featuredPhoto
</script>

<template>
	<div class="my-2 w-full flex flex-row items-center justify-between cursor-pointer">
		<!-- Title -->
		<button class="flex flex-grow flex-col overflow-hidden focus:outline-none" @click="setActiveDraft(draft)">
			<h6
				class="truncate text-base font-semibold dark:text-darkPrimaryText"
				:style="$route.name === `home` && inWidget ? `max-width: 259px` : `max-width: 390px`"
			>
				{{ draft.title === `` ? `New Post` : draft.title }}
			</h6>
			<p class="text-gray5 dark:text-gray3 text-sm">Last saved {{ formatDate(draft.timestamp) }}</p>
		</button>
		<!-- Featured image -->
		<button
			class="mx-4 w-24 flex-shrink-0 items-center focus:outline-none"
			:class="inWidget ? `hidden xl:flex` : `flex`"
			@click="setActiveDraft(draft)"
		>
			<img
				v-if="featuredPhoto !== null"
				v-lazy="{ src: featuredPhoto }"
				:alt="draft.title"
				class="h-16 w-full flex-shrink-0 rounded-lg object-cover"
			/>
			<span
				v-else
				class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray2 flex h-16 w-24 items-center justify-center rounded-lg"
			>
				<ImageIcon class="h-5 w-5 fill-current" />
			</span>
		</button>
		<div class="icon relative flex items-center">
			<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="toggleDropdownDelete">
				<MoreIcon />
			</button>
			<div
				v-show="showDelete"
				class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
				:class="settings.isDarkMode ? `dropdownDraftOpenDark` : `dropdownDraftOpen`"
				style="top: 35px; right: -5px"
			>
				<button class="focus:outline-none text-primary flex" @click="setActiveDraft(draft)">
					<PencilIcon class="fill-current p-1" />
					<span class="text-primary ml-1 self-center text-sm">Edit this draft</span>
				</button>
				<!-- Delete -->
				<button class="focus:outline-none text-negative mt-2 flex" @click="deleteDraft(draft)">
					<BinIcon class="p-1" />
					<span class="text-negative ml-1 self-center text-sm">Delete this draft</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style>
.dropdownDraftOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownDraftOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>
