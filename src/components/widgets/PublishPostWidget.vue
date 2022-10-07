<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import PreviewIcon from '@/components/icons/PreviewIcon.vue';

const settings = useStoreSettings();

const hoverPreview = ref(false);
//should correspond to draft.wordcount
const dummyWordcount = ref(0);
</script>
<template>
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border p-6 shadow-lg">
		<div class="flex flex-row items-center justify-between">
			<div>
				<h5 v-show="dummyWordcount > 1" class="text-gray5 dark:text-gray3 text-sm">
					<span class="text-primary">{{ dummyWordcount }}</span> words
				</h5>
				<h5 class="text-gray5 dark:text-gray3 text-sm">Auto-save on close.</h5>
			</div>
			<div class="relative">
				<button
					class="mr-5 text-gray5 dark:text-gray3 transition duration-500 ease-in-out hover:text-primary"
					@mouseenter="hoverPreview = true"
					@mouseleave="hoverPreview = false"
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
				>
					Publish
				</button>
			</div>
		</div>
	</article>
</template>
