<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { IMode, modes } from '@/config/colors';
import XIcon from '@/components/icons/CloseIcon.vue';

const settings = useStoreSettings();
const emit = defineEmits([`close`]);

const selectedMode = ref<IMode>(getCurrentMode(settings.mode));

function getCurrentMode(label: string): IMode {
	for (const mode of modes) {
		if (mode.label === label) {
			return mode;
		}
	}
	return modes[0];
}

function setMode(mode: IMode) {
	selectedMode.value = mode;
}

function confirmMode() {
	if (selectedMode.value.label === settings.mode) {
		return;
	}
	settings.setMode(selectedMode.value.label);
	emit(`close`);
}

function scrollToCurrent() {
	const view = document.getElementById(`selectedMode`);
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
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Inner space -->
		<div class="popup w-full lg:w-600 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg">
			<!-- Header and close icon -->
			<div class="flex items-center justify-between px-6 py-4 mb-4">
				<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
					Change your Blogchain light mode
				</h4>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="emit(`close`)">
					<XIcon />
				</button>
			</div>
			<!-- color mode grid -->
			<div class="flex flex-col lg:flex-row justify-between px-6 pt-4">
				<button
					v-for="x of modes"
					:key="x.label"
					class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
					@click="setMode(x)"
				>
					<img
						v-if="selectedMode.label === x.label"
						id="selectedMode"
						:src="(x.image as string)"
						class="border-primary h-32 w-44 rounded-lg border shadow-lg"
					/>
					<img v-else :src="(x.image as string)" class="border-lightBorder h-32 w-44 rounded-lg border shadow-lg" />
					<span
						class="mt-1 text-center"
						:class="selectedMode.label === x.label ? `text-primary` : `text-gray5 dark:text-gray3`"
						>{{ x.label }}</span
					>
				</button>
			</div>
			<!-- Select button -->
			<div class="flex items-center justify-end p-6 pt-5">
				<button
					class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white"
					:class="selectedMode.label === settings.mode ? `opacity-50` : ``"
					:disabled="selectedMode.label === settings.mode"
					@click="confirmMode"
				>
					Select
				</button>
			</div>
		</div>
	</div>
</template>
