<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useMeta } from 'vue-meta';

import { useDraftStore } from '@/store/drafts';
import { useRootStore } from '@/store/index';

import XIcon from '@/components/icons/XIcon.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import Quill from '@/components/Editor/Quill.vue';
import PreviewPopup from '@/components/post/PreviewPopup.vue';
import ConfirmPopup from '@/components/popups/ConfirmPopup.vue';
import DraftsPopup from '@/components/popups/DraftsPopup.vue';
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
const rootStore = useRootStore();

const draft = computed(() => draftStore.getActiveDraft);
const activeIndex = computed(() => draftStore.getActiveIndex);
const isSaving = ref(false);
const titleError = ref(``);
const subtitleError = ref(``);
const titleInput = ref<HTMLTextAreaElement>();
const subtitleInput = ref<HTMLTextAreaElement>();
const editor = ref();
const showPostPreview = computed(() => rootStore.$state.showDraftPreview);
const showConfirmPopup = ref(false);
const showDrafts = ref(false);
const draftButtonHidden = ref(false);

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

function hideDraftButton(value: boolean) {
	const draftButton = document.getElementById(`draftButton`);
	if (!draftButton) {
		return;
	}
	if (value === true) {
		draftButton.classList.add(`hidedraftButton`);
		draftButtonHidden.value = true;
	} else {
		draftButton.classList.remove(`hidedraftButton`);
		draftButtonHidden.value = false;
	}
}

async function sleep(ms: any) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleSave() {
	isSaving.value = true;
	editor.value.updateContent();
	await sleep(800);
	isSaving.value = false;
}

function saveContent() {
	editor.value.updateContent();
	router.go(-1);
}

function closePostPreview() {
	rootStore.toggleDraftPreview(false);
}

function checkPostPreview() {
	showConfirmPopup.value = true;
	rootStore.toggleDraftPreview(false);
}

function sendPost() {
	showConfirmPopup.value = false;
	//send post to backend from store and redirect to the the published post
	editor.value.updateContent();
}

function initDraft() {
	if (!titleInput.value || !subtitleInput.value) {
		return;
	}
	titleInput.value.value = draft.value.title;
	titleInput.value.style.height = `60px`;
	titleInput.value.style.height = `${titleInput.value.scrollHeight}px`;
	subtitleInput.value.value = draft.value.subtitle ? draft.value.subtitle : ``;
	subtitleInput.value.style.height = `60px`;
	subtitleInput.value.style.height = `${subtitleInput.value.scrollHeight}px`;
}

function handleCloseDrafts() {
	showDrafts.value = false;
	initDraft();
	editor.value.setupEditor();
}

watch(activeIndex, () => {
	initDraft();
});

onMounted(() => {
	initDraft();
});
</script>

<template>
	<div id="scrollable_content" class="min-h-88 h-88 w-full relative p-8">
		<!-- Title, dave, close -->
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

		<!-- Subtitle -->
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
		</article>
		<!-- WYSIWYG -->
		<article class="w-full">
			<Quill
				ref="editor"
				:initial-content="draft.content"
				:valid-image-types="validMimeTypes"
				:image-uploader="uploadPhoto"
				:is-primary-widget="false"
				:allowed-tags="BASE_ALLOWED_TAGS"
				@is-writing="hideDraftButton"
			/>
		</article>
	</div>
	<div
		id="draftButton"
		class="animatedraftButton bg-lightBG dark:bg-darkBG border-lightBorder text-xs text-gray5 dark:text-gray3 modal-animation card-animation-delay1 absolute bottom-0 z-10 m-4 flex rounded-lg py-3 shadow-lg"
		:class="draftButtonHidden ? `px-3` : `px-5`"
	>
		<p v-if="!draftButtonHidden" class="mr-2">Resume writing?</p>
		<button v-if="!draftButtonHidden" class="text-primary focus:outline-none" @click="showDrafts = true">
			Show drafts
		</button>
		<button v-else class="text-primary focus:outline-none" @click="showDrafts = true">
			<PencilIcon class="fill-current p-1" />
		</button>
	</div>
	<PreviewPopup v-if="showPostPreview" @close="closePostPreview" @confirm="checkPostPreview" />
	<ConfirmPopup v-if="showConfirmPopup" @close="showConfirmPopup = false" @post="sendPost" />
	<DraftsPopup v-if="showDrafts" @close="handleCloseDrafts" />
</template>
<style>
.animatedraftButton {
	transition: all 0.4s;
}
.hidedraftButton {
	transform: translateX(-2rem);
	padding: 0.7rem;
}
</style>
