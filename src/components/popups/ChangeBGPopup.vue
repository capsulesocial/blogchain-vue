<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { IBackground, backgrounds } from '@/config/backgrounds';
import XIcon from '@/components/icons/CloseIcon.vue';

const store = useStore();
const settings = useStoreSettings();
const emit = defineEmits([`close`]);

const selectedBG = ref<IBackground>(getCurrentBG(store.background));

function getCurrentBG(id: string): IBackground {
	for (const bg of backgrounds) {
		if (bg.id === id) {
			return bg;
		}
	}
	return backgrounds[0];
}

function setBackgroundImage(background: IBackground) {
	selectedBG.value = background;
}

function confirmBackgroundImage() {
	if (selectedBG.value.id === store.background) {
		return;
	}
	store.setBackground(selectedBG.value.id);
	emit(`close`);
}

function scrollToCurrent() {
	const view = document.getElementById(`selectedBG`);
	console.log(view);
	if (!view) {
		return;
	}
	view.scrollIntoView({ block: `center`, behavior: `smooth` });
}

onMounted(() => {
	scrollToCurrent();
});
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center dark:bg-opacity-50 bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Inner space -->
		<div
			class="popup w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between px-6 py-4">
				<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
					Change your Blogchain background
				</h4>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="emit(`close`)">
					<XIcon />
				</button>
			</div>
			<!-- Background grid -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-1 overflow-y-scroll p-6 pt-4" style="height: 500px">
				<button
					v-for="x of backgrounds"
					:key="x.label"
					class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
					@click="setBackgroundImage(x)"
				>
					<img
						v-if="selectedBG.label === x.label"
						id="selectedBG"
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
						:class="selectedBG.label === x.label ? `text-primary` : `text-gray5 dark:text-gray3`"
						>{{ x.label }}</span
					>
				</button>
			</div>
			<!-- Select button -->
			<div class="flex items-center justify-end p-6 pt-5">
				<button
					class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white"
					:class="selectedBG.id === store.background ? `opacity-50` : ``"
					:disabled="selectedBG.id === store.background"
					@click="confirmBackgroundImage"
				>
					Select
				</button>
			</div>
		</div>
	</div>
</template>
