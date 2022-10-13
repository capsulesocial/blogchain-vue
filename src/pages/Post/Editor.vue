<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useDraftStore } from '@/store/drafts';
import XIcon from '@/components/icons/XIcon.vue';
import Quill from '@/components/Editor/Quill.vue';
import { qualitySubtitle, qualityTitle } from '@/plugins/quality';
import { isError } from '@/plugins/helpers';
import { validMimeTypes } from '@/backend/utilities/helpers';
import { uploadPhoto } from '@/backend/photos';
import { BASE_ALLOWED_TAGS } from '@/helpers/helpers';
import router from '@/router';

useMeta({
	title: `dynamicPostTitle`,
	htmlAttrs: { lang: 'en', amp: true },
});

const draftStore = useDraftStore();
const draft = computed(() => draftStore.getActiveDraft);
const isSaving = ref(false);
const titleError = ref(``);
const subtitleError = ref(``);
const titleInput = ref<HTMLTextAreaElement>();
const subtitleInput = ref<HTMLTextAreaElement>();
const editor = ref();

function handleTitle(e: any) {
	if (!titleInput.value || !subtitleInput.value || !e) {
		return;
	}
	if (e.inputType === `insertLineBreak` || (e.inputType === `insertText` && e.data === null)) {
		e.preventDefault();
		titleInput.value.value.replace(/\n*$/, '');
		subtitleInput.value.focus();
	}
	titleInput.value.style.height = `60px`;
	titleInput.value.style.height = `${titleInput.value.scrollHeight}px`;
	const title: string = titleInput.value.value.trim();
	const titleQualityCheck = qualityTitle(title);
	if (isError(titleQualityCheck)) {
		if (titleQualityCheck.error === `Please enter a title.`) {
			return;
		}
		titleError.value = titleQualityCheck.error;
	} else {
		titleError.value = ``;
	}
	draftStore.setTitle(title);
}

function handleSubtitle(e: any) {
	if (!subtitleInput.value || !e) {
		return;
	}
	if (e.inputType === `insertLineBreak` || (e.inputType === `insertText` && e.data === null)) {
		e.preventDefault();
		subtitleInput.value.value.replace(/\n*$/, '');
		// focus on editor
	}
	subtitleInput.value.style.height = `60px`;
	subtitleInput.value.style.height = `${subtitleInput.value.scrollHeight}px`;
	const subtitle: string = subtitleInput.value.value.trim();
	const subtitleQualityCheck = qualitySubtitle(subtitle);
	if (isError(subtitleQualityCheck)) {
		subtitleError.value = subtitleQualityCheck.error;
	} else {
		subtitleError.value = ``;
	}
	draftStore.setSubtitle(subtitle);
}

async function sleep(ms: any) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleSave() {
	isSaving.value = true;
	editor.value.updateContent();
	await sleep(600);
	console.log(`done sleeping`);
	await sleep(800);
	isSaving.value = false;
}
function saveContent() {
	editor.value.updateContent();
	router.go(-1);
}

onMounted(() => {
	if (!titleInput.value || !subtitleInput.value) {
		return;
	}
	titleInput.value.value = draft.value.title;
	titleInput.value.style.height = `60px`;
	titleInput.value.style.height = `${titleInput.value.scrollHeight}px`;
	subtitleInput.value.value = draft.value.subtitle ? draft.value.subtitle : ``;
	subtitleInput.value.style.height = `60px`;
	subtitleInput.value.style.height = `${subtitleInput.value.scrollHeight}px`;
});
</script>

<template>
	<div id="scrollable_content" class="min-h-61 h-61 w-full overflow-y-auto lg:overflow-y-hidden relative">
		<!-- Title, subtitle -->
		<article class="flex flex-col px-2">
			<div v-if="!isSaving && $route.name !== 'home'" class="absolute right-0 top-0 flex flex-row items-center m-8">
				<p class="mr-5 cursor-pointer text-primary" @click="handleSave">Save</p>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="saveContent">
					<XIcon />
				</button>
			</div>
			<article v-else-if="isSaving" class="modal-animation absolute right-0 top-0 p-8">
				<div
					class="loader border-2 border-gray1 dark:border-gray7 h-6 w-6 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</article>
			<p v-else class="text-positive modal-animation absolute right-0 top-0 p-8">
				<span v-if="$route.name !== 'home'">Saved!</span>
			</p>
			<p class="text-negative text-xs">{{ titleError }}</p>
			<label for="title" class="hidden">Title</label>
			<textarea
				id="title"
				ref="titleInput"
				placeholder="Title"
				class="text-4xl dark:text-darkPrimaryText focus:outline-none w-11/12 break-words -mt-2 mb-2 bg-transparent font-serif placeholder-gray5 dark:placeholder-gray1"
				wrap="soft"
				style="resize: none"
				@input="handleTitle"
			/>
		</article>

		<!-- Subtitle input -->
		<article class="flex flex-col px-2">
			<p class="text-negative text-xs">{{ subtitleError }}</p>
			<label for="subtitle" class="hidden">Subtitle</label>
			<textarea
				id="subtitle"
				ref="subtitleInput"
				placeholder="Subtitle"
				class="text-h2 text-gray5 dark:text-gray2 placeholder-gray5 dark:placeholder-gray2 focus:outline-none mt-2 w-full break-words bg-transparent font-serif"
				wrap="soft"
				style="resize: none"
				@input="handleSubtitle"
			/>

			<!-- WYSIWYG -->
			<Quill
				ref="editor"
				:initial-content="draft.content"
				:valid-image-types="validMimeTypes"
				:image-uploader="uploadPhoto"
				:is-primary-widget="false"
				:allowed-tags="BASE_ALLOWED_TAGS"
			/>
		</article>
	</div>
</template>
