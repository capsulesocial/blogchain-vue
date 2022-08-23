<script setup lang="ts">
import XIcon from '@/components/icons/CloseIcon.vue';
import Check from '@/components/icons/Check.vue';
import { backgrounds, getBackground } from '@/config/backgrounds';
import { getBGImage } from '@/plugins/background';
import { colors, modes } from '@/config/colors';
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { useStore } from '@/store/session';
import { initColors } from '@/plugins/colors';

const settings = useStoreSettings();
const session = useStore();
console.log(getBackground(session.background));
const selectedBG = ref(backgrounds[0]);
const showPopupBG = ref(false);
const showPopupMode = ref(false);
const showPopupColor = ref(false);

function confirmBackgroundImage() {
	if (selectedBG.value.id === session.background) {
		return;
	}
	session.setBackground(selectedBG.value.id);
}
function setColorMode(mode: 'Light' | 'Dark' | 'OS') {
	settings.setMode(mode);
	initColors();
}
function setColor(color: `Green` | `Orange` | `Blue` | `Pink` | `Yellow`) {
	console.log(color);
	settings.setColor(color);
}
function confirmColor() {}
</script>

<template>
	<div class="px-6 pt-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Display</h3>
		<div class="mb-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-36 xl:w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Background</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupBG = true">
				<p class="mr-4">
					{{ session.background }}
				</p>
				<img
					v-lazy="{ src: getBGImage(session.background) }"
					class="h-20 w-32 rounded-lg bg-lightBG dark:bg-darkBG border border-lightBorder"
				/>
			</button>
		</div>
		<div class="mb-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Light Mode</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupMode = true">
				<p class="mr-4">{{ settings.mode }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-lightBG dark:bg-darkBG"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-gray5 dark:bg-gray3"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-darkBG dark:bg-lightBG"></div>
			</button>
		</div>
		<div class="mb-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Color Theme</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="showPopupColor = true">
				<p class="mr-4">{{ settings.color }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-primary"></div>
			</button>
		</div>
		<!-- Popup background selector -->
		<Teleport to="#popup">
			<div
				v-if="showPopupBG"
				class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center dark:bg-opacity-50 bg-opacity-50"
				@click.self="showPopupBG = false"
			>
				<!-- Inner space -->
				<div
					class="popup w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg"
				>
					<!-- Header and close icon -->
					<div class="flex items-center justify-between p-6 pb-2">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
							Change your Blogchain background
						</h4>
						<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="showPopupBG = false">
							<XIcon />
						</button>
					</div>
					<!-- Background grid -->
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-1 overflow-y-scroll p-6 pt-4" style="height: 500px">
						<button
							v-for="x of backgrounds"
							:key="x.label"
							class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
							@click="selectedBG = x"
						>
							<img
								v-if="selectedBG.id === x.id"
								:src="settings.isDarkMode ? x.dark : x.light"
								class="border-primary h-44 w-64 rounded-lg border shadow-lg bg-lightBG dark:bg-darkBG"
							/>
							<img
								v-else
								:src="settings.isDarkMode ? x.dark : x.light"
								class="border-lightBorder h-44 w-64 rounded-lg border shadow-lg bg-lightBG dark:bg-darkBG"
							/>
							<span
								class="mt-1 text-center"
								:class="selectedBG === x ? `text-primary` : `text-gray5 dark:text-gray3`"
								>{{ x.label }}</span
							>
						</button>
					</div>
					<!-- Select button -->
					<div class="flex items-center justify-end p-6 pt-5">
						<button
							class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white"
							@click="confirmBackgroundImage"
						>
							Select
						</button>
					</div>
				</div>
			</div>
			<!-- Popup Mode selector -->
			<div
				v-if="showPopupMode"
				class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
				@click.self="showPopupMode = false"
			>
				<!-- Inner space -->
				<div class="popup w-full lg:w-600 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg">
					<!-- Header and close icon -->
					<div class="flex items-center justify-between p-6 pb-2 mb-4">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
							Change your Blogchain light mode
						</h4>
						<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="showPopupMode = false">
							<XIcon />
						</button>
					</div>
					<!-- color mode grid -->
					<div class="flex flex-col lg:flex-row justify-between p-6 pt-4">
						<button
							v-for="x of modes"
							:key="x.label"
							class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
							@click="setColorMode(x.label)"
						>
							<img
								v-if="settings.mode === x.label"
								:src="(x.image as string)"
								class="border-primary h-32 w-44 rounded-lg border shadow-lg"
							/>
							<img v-else :src="(x.image as string)" class="border-lightBorder h-32 w-44 rounded-lg border shadow-lg" />
							<span
								class="mt-1 text-center"
								:class="settings.mode === x.label ? `text-primary` : `text-gray5 dark:text-gray3`"
								>{{ x.label }}</span
							>
						</button>
					</div>
					<!-- Select button -->
					<div class="flex items-center justify-end p-6 pt-5">
						<button
							class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white"
							@click="showPopupMode = false"
						>
							Select
						</button>
					</div>
				</div>
			</div>
			<!-- Popup Color selector -->
			<div
				v-if="showPopupColor"
				class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
				@click.self="showPopupColor = false"
			>
				<!-- Inner space -->
				<div class="popup w-full lg:w-600 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg">
					<!-- Header and close icon -->
					<div class="flex items-center justify-between p-6 pb-2 mb-4">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
							Change your Blogchain color theme
						</h4>
						<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="showPopupColor = false">
							<XIcon />
						</button>
					</div>
					<!-- color grid -->
					<div class="flex flex-row justify-between m-6 py-4 bg-lightInput dark:bg-darkInput rounded-lg">
						<button
							v-for="x of colors"
							:key="(x.id as string)"
							class="focus:outline-none flex flex-shrink-0 flex-col items-center w-1/5"
							@click="setColor(x.id)"
						>
							<div class="flex flex-col justify-center items-center">
								<Check v-if="settings.color === x.id" class="text-lightBG h-4 w-4 absolute" />
								<div
									class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
									:style="`background-color:` + x.hex"
								></div>
							</div>
							<p class="mt-2" :class="settings.color === x.id ? `text-primary` : `text-gray5 dark:text-gray3`">
								{{ x.id }}
							</p>
						</button>
						<!-- <button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Orange`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #ff4747"
						></div>
					</button>
					<button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Blue`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #396bf8"
						></div>
					</button>
					<button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Pink`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #eb3d7c"
						></div>
					</button>
					<button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Yellow`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #ffcc33"
						></div>
					</button> -->
					</div>
					<!-- Select button -->
					<div class="flex items-center justify-end p-6 pt-5">
						<button class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white" @click="confirmColor">
							Select
						</button>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>
