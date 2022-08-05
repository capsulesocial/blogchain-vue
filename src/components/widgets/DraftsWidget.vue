<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { Post } from '@/backend/post';
import HorizontalDraftPreview from '@/components/HorizontalDraftPreview.vue';
import InfoIcon from '../../components/icons/Info.vue';

const settings = useStoreSettings();
const store = useStore();
const showInfo = ref<boolean>(false);

type DraftPost = Omit<Post, `authorID`>;

// TODO: fetch followers from store / backend
const drafts = ref<DraftPost[]>([
	{
		title: `First Draft`,
		subtitle: ``,
		content: ``,
		featuredPhotoCID: null,
		featuredPhotoCaption: null,
		tags: [],
		category: ``,
		timestamp: 0,
		postImages: [],
		encrypted: false,
	},
	{
		title: `Second Draft`,
		subtitle: ``,
		content: ``,
		featuredPhotoCID: null,
		featuredPhotoCaption: null,
		tags: [],
		category: ``,
		timestamp: 1,
		postImages: [],
		encrypted: false,
	},
]);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4 relative">
		<div class="flex flex-row justify-between items-center">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Drafts</h3>
			<div @mouseenter="showInfo = true" @mouseleave="showInfo = false">
				<InfoIcon class="w-4 h-4 text-gray5 dark:text-gray3" />
			</div>
		</div>
		<div v-if="store.$state.id !== ``">
			<div v-if="drafts.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<p class="text-gray5 dark:text-gray3 pt-3 text-sm mb-4">
					You don't have any drafts yet,
					<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/post`)">write a new draft</button>
				</p>
			</div>
			<HorizontalDraftPreview v-for="draft in drafts" :key="draft.timestamp" :draft="draft" />
			<button class="text-primary text-sm mt-2" @click="$emit(``)">Show more</button>
		</div>
		<div v-else class="text-gray5 dark:text-gray3 pt-3 text-sm">
			<button class="text-primary focus:outline-none" @click="$router.push(`/register`)">Sign up</button>
			to create drafts and save content
		</div>
		<div
			v-show="showInfo"
			class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
			:class="settings.isDarkMode ? `DraftInfoOpenDark` : `DraftInfoOpen`"
			style="top: 55px; right: 7px; width: 80%"
		>
			Note: drafts are stored in your browser's local storage and may be erased on actions such as clearing history
		</div>
	</div>
</template>

<style>
.DraftInfoOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 1rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.DraftInfoOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 1rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
	z-index: 1;
}
</style>
