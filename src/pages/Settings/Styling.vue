<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { getBGImage } from '@/plugins/background';
import { getCurrentBG } from '@/config/backgrounds';
import { initColors } from '@/plugins/colors';

import ChangeBGPopup from '@/components/popups/ChangeBGPopup.vue';
import ChangeModePopup from '@/components/popups/ChangeModePopup.vue';
import ChangeColorPopup from '@/components/popups/ChangeColorPopup.vue';

const settings = useStoreSettings();
const session = useStore();

const currentBG = ref(getCurrentBG(session.background));

const showPopupBG = ref(false);
const showPopupMode = ref(false);
const showPopupColor = ref(false);

function refreshCurrentBG() {
	showPopupBG.value = false;
	currentBG.value = getCurrentBG(session.background);
}

function refreshCurrentMode() {
	showPopupMode.value = false;
	initColors();
}

function refreshCurrentColor() {
	showPopupColor.value = false;
	initColors();
}
</script>

<template>
	<div id="scrollable_content" class="px-6 pt-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Display</h3>
		<div class="flex w-full items-center justify-between">
			<h3 class="w-36 xl:w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Background</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupBG = true">
				<p v-if="session.background !== ``" class="mr-4">
					{{ currentBG.label }}
				</p>
				<p v-else class="mr-4">Default</p>
				<img
					v-lazy="{ src: getBGImage(session.background) }"
					class="h-20 w-32 rounded-lg bg-lightBG dark:bg-darkBG border border-lightBorder"
				/>
			</button>
		</div>
		<div class="mt-8 flex w-full items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Light Mode</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupMode = true">
				<p class="mr-4">{{ settings.mode }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-lightBG dark:bg-darkBG"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-gray5 dark:bg-gray3"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-darkBG dark:bg-lightBG"></div>
			</button>
		</div>
		<div class="mt-8 flex w-full items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Color Theme</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupColor = true">
				<p class="mr-4">{{ settings.color }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-primary"></div>
			</button>
		</div>
	</div>
	<Teleport to="body">
		<ChangeBGPopup v-if="showPopupBG" @close="refreshCurrentBG" />
		<ChangeModePopup v-if="showPopupMode" @close="refreshCurrentMode" />
		<ChangeColorPopup v-if="showPopupColor" @close="refreshCurrentColor" />
	</Teleport>
</template>
