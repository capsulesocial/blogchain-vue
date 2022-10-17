<script setup lang="ts">
import { computed, ref } from 'vue';

import { useStoreSettings } from '@/store/settings';
import { useRootStore } from '@/store/index';

import PreviewIcon from '@/components/icons/PreviewIcon.vue';
import ConfirmPopup from '@/components/popups/ConfirmPopup.vue';
import { useDraftStore } from '@/store/drafts';

const settings = useStoreSettings();
const rootStore = useRootStore();
const draftStore = useDraftStore();

const hoverPreview = ref(false);
//should correspond to draft.wordcount
const wordCount = computed(() => draftStore.getWordCount);
const showConfirmPopup = ref(false);

function togglePreview() {
	rootStore.toggleDraftPreview(true);
}

function sendPost() {
	//send post to backend from store and redirect to the the published post
	if (draftStore.checkPost) {
		draftStore.sendPost();
	}
}
</script>
<template>
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border p-6 shadow-lg">
		<div class="flex flex-row items-center justify-between">
			<div>
				<h5 v-show="wordCount > 1" class="text-gray5 dark:text-gray3 text-sm">
					<span class="text-primary">{{ wordCount }}</span> words
				</h5>
				<h5 class="text-gray5 dark:text-gray3 text-sm">Auto-save on close.</h5>
			</div>
			<div class="relative">
				<button
					class="mr-5 text-gray5 dark:text-gray3 transition duration-500 ease-in-out hover:text-primary"
					@mouseenter="hoverPreview = true"
					@mouseleave="hoverPreview = false"
					@click="togglePreview"
				>
					<PreviewIcon />
				</button>
				<!-- post preview tooltip -->
				<div
					v-show="hoverPreview"
					class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
					:class="settings.isDarkMode ? `hoverPreviewDark` : `hoverPreview`"
					style="top: 2px; right: 214px; width: 47%"
				>
					Preview post
				</div>
				<button
					class="focus:outline-none bg-primary text-lightButtonText transform rounded-lg px-12 py-2 font-bold shadow-lg transition duration-500 ease-in-out hover:scale-105"
					@click="showConfirmPopup = true"
				>
					Publish
				</button>
			</div>
		</div>
	</article>
	<ConfirmPopup v-if="showConfirmPopup" @close="showConfirmPopup = false" @post="sendPost" />
</template>
<style>
.hoverPreview::before {
	content: '';
	position: absolute;
	top: 0.5rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.hoverPreviewDark::before {
	content: '';
	position: absolute;
	top: 0.5rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #686868;
	border-radius: 2px;
	z-index: 1;
}
</style>
