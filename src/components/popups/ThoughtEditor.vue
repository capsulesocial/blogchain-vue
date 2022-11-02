<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue';
import BrandedButton from '../BrandedButton.vue';
import PlusIcon from '../icons/PlusIcon.vue';
import XIcon from '../icons/XIcon.vue';
import { useDraftStore } from '@/store/drafts';
import { qualityTags } from '@/plugins/quality';
import { ref } from 'vue';
import { isError } from '@/plugins/helpers';
import { toastError } from '@/plugins/toast';

const draftStore = useDraftStore();
const thoughtInput = ref<HTMLInputElement>();
const tagInput = ref<HTMLInputElement>();
const length = ref(0);
const tags = ref<string[]>([]);

function handleInput() {
	if (!thoughtInput.value) {
		return;
	}
	length.value = thoughtInput.value.value.length;
}

function handleTag() {
	const tag = tagInput.value?.value;
	if (!tag) {
		return;
	}
	const quality: { error: string } | { success: boolean } = qualityTags(tag, tags.value);
	if (isError(quality)) {
		toastError(quality.error);
		return;
	}
	tags.value.push(tag);
	if (!tagInput.value) {
		return;
	}
	tagInput.value.value = ``;
}

function removeTag(t: string) {
	const i = tags.value.indexOf(t);
	tags.value.splice(i, 1);
}

function sendThought() {
	console.log(thoughtInput.value?.value);
	console.log(thoughtInput.value?.value.length);
}
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-40 flex h-screen w-full items-start justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="draftStore.toggleThought"
	>
		<div
			class="popup popupCard w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation mt-12 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-4xl font-semibold">Write a Thought</h1>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="draftStore.toggleThought">
					<CloseIcon />
				</button>
			</div>
			<!-- Input textarea -->
			<div class="">
				<textarea
					ref="thoughtInput"
					class="w-full h-32 resize-none bg-gray1 dark:bg-gray5 rounded-lg focus:outline-none p-1"
					@keydown="handleInput"
				/>
			</div>
			<!-- Post metadata -->
			<div class="text-sm text-lightSecondaryText flex justify-between mb-4">
				<!-- Add tags -->
				<div class="flex flex-row-reverse">
					<input v-show="tags.length < 3" ref="tagInput" type="text" placeholder="Tag" @keypress.enter="handleTag" />
					<button
						v-for="t in tags"
						:key="t"
						class="bg-gray1 px-2 py-1 mr-2 rounded-lg flex items-center"
						@click="removeTag(t)"
					>
						{{ t }}
						<XIcon class="p-1" />
					</button>
				</div>
				<!-- Add image -->
				<button class="text-primary flex items-center"><PlusIcon class="p-1" />Add image</button>
			</div>
			<!-- Post and convert buttons -->
			<div class="flex justify-between items-center">
				<button>Convert to Post</button>
				<BrandedButton :text="`Send Thought`" :action="sendThought" />
			</div>
		</div>
	</div>
</template>
