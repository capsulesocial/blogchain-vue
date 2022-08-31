<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { IColor, colors } from '@/config/colors';
import XIcon from '@/components/icons/CloseIcon.vue';
import Check from '@/components/icons/Check.vue';

const settings = useStoreSettings();
const emit = defineEmits([`close`]);

const selectedColor = ref<IColor>(getCurrentColor(settings.color));

function getCurrentColor(id: string): IColor {
	for (const color of colors) {
		if (color.id === id) {
			return color;
		}
	}
	return colors[0];
}

function setColor(color: IColor) {
	selectedColor.value = color;
}

function confirmColor() {
	if (selectedColor.value.id === settings.color) {
		return;
	}
	settings.setColor(selectedColor.value.id);
	emit(`close`);
}

function scrollToCurrent() {
	const view = document.getElementById(`selectedColor`);
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
					Change your Blogchain color theme
				</h4>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="emit(`close`)">
					<XIcon />
				</button>
			</div>
			<!-- color grid -->
			<div class="flex flex-row justify-between m-4 py-4 bg-lightInput dark:bg-darkInput rounded-lg">
				<button
					v-for="x of colors"
					:key="x.id"
					class="focus:outline-none flex flex-shrink-0 flex-col items-center w-1/5"
					@click="setColor(x)"
				>
					<div class="flex flex-col justify-center items-center">
						<Check v-if="selectedColor.id === x.id" class="text-lightBG h-4 w-4 absolute" />
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							:style="`background-color:` + x.hex"
						></div>
					</div>
					<p class="mt-2" :class="selectedColor.id === x.id ? `text-primary` : `text-gray5 dark:text-gray3`">
						{{ x.id }}
					</p>
				</button>
			</div>
			<!-- Select button -->
			<div class="flex items-center justify-end p-6 pt-5">
				<button
					class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white"
					:class="selectedColor.id === settings.color ? `opacity-50` : ``"
					:disabled="selectedColor.id === settings.color"
					@click="confirmColor"
				>
					Select
				</button>
			</div>
		</div>
	</div>
</template>
