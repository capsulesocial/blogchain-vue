<script setup lang="ts">
// import XIcon from '@/components/icons/CloseIcon.vue';
// import Check from '@/components/icons/Check.vue';
import { getBGImage } from '@/plugins/background';
// import { colors, modes } from '@/config/colors';
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { useStore } from '@/store/session';
// import { initColors } from '@/plugins/colors';

const settings = useStoreSettings();
const session = useStore();
// const selectedBG = ref(backgrounds[0]);
const showPopupBG = ref(false);
const showPopupMode = ref(false);
const showPopupColor = ref(false);
// console.log(getBGImage(session.background));

// function confirmBackgroundImage() {
// 	if (selectedBG.value.id === session.background) {
// 		return;
// 	}
// 	session.setBackground(selectedBG.value.id);
// }
// function setColorMode(mode: 'Light' | 'Dark' | 'OS') {
// 	settings.setMode(mode);
// 	initColors();
// }
// function setColor(color: `Green` | `Orange` | `Blue` | `Pink` | `Yellow`) {
// 	console.log(color);
// 	settings.setColor(color);
// }
// function confirmColor() {}
</script>

<template>
	<div class="px-6 pt-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Display</h3>
		<div class="flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-36 xl:w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Background</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupBG = true">
				<p v-if="session.background !== ``" class="mr-4">
					{{ session.background }}
				</p>
				<p v-else class="mr-4">Default</p>
				<img
					v-lazy="{ src: getBGImage(session.background) }"
					class="h-20 w-32 rounded-lg bg-lightBG dark:bg-darkBG border border-lightBorder"
					style="height: 5rem"
				/>
			</button>
		</div>
		<div class="mt-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Light Mode</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupMode = true">
				<p class="mr-4">{{ settings.mode }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-lightBG dark:bg-darkBG"></div>
				<div
					class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-gray5 dark:bg-gray3"
					style="margin-left: -0.5rem"
				></div>
				<div
					class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-darkBG dark:bg-lightBG"
					style="margin-left: -0.5rem"
				></div>
			</button>
		</div>
		<div class="mt-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Color Theme</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupColor = true">
				<p class="mr-4">{{ settings.color }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-primary"></div>
			</button>
		</div>
	</div>
</template>
