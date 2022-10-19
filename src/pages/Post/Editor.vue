<script setup lang="ts">
import { computed, onMounted, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import { useDraftStore } from '@/store/drafts';
import { useRootStore } from '@/store/index';
import { useStore as useSessionStore } from '@/store/session';
import { useStoreSettings as useSettingsStore } from '@/store/settings';

import XIcon from '@/components/icons/XIcon.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import Quill from '@/components/Editor/Quill.vue';
import PreviewPopup from '@/components/post/PreviewPopup.vue';
import ConfirmPopup from '@/components/popups/ConfirmPopup.vue';
import DraftsPopup from '@/components/popups/DraftsPopup.vue';
import { qualityContent, qualityFeaturedPhotoCaption, qualitySubtitle, qualityTitle } from '@/plugins/quality';

import { isError } from '@/plugins/helpers';
import { validMimeTypes } from '@/backend/utilities/helpers';
import { preUploadPhoto, uploadPhoto } from '@/backend/photos';
import { BASE_ALLOWED_TAGS } from '@/helpers/helpers';
import { createRegularPost, IKeyData, sendEncryptedPost, sendRegularPost, Tag } from '@/backend/post';
import { toastError } from '@/plugins/toast';
import turndownService from '@/components/Editor/TurndownService';
import { createEditorImageSet, EditorImages } from '@/components/Editor/helpers';
import textLimits from '@/backend/utilities/text_limits';
import { createEncryptedPost } from '../../backend/post';

useMeta({
	title: `dynamicPostTitle`,
	htmlAttrs: { lang: 'en', amp: true },
});

const emit = defineEmits([`isWriting`, `updateWordCount`]);

const router = useRouter();
const draftStore = useDraftStore();
const rootStore = useRootStore();
const sessionStore = useSessionStore();
const settingsStore = useSettingsStore();

const draft = computed(() => draftStore.getActiveDraft);
const activeIndex = computed(() => draftStore.getActiveIndex);
const isSaving = ref(false);
const showSaved = ref(false);
const titleError = ref(``);
const subtitleError = ref(``);
const titleInput = ref<HTMLTextAreaElement>();
const subtitleInput = ref<HTMLTextAreaElement>();
const wordCount = ref(0);
const hasPosted = ref(false);
const isX = ref(false);
const postImageKeys = ref<EditorImages>(new Map());
const editor = ref();
const showPostPreview = computed(() => rootStore.$state.showDraftPreview);
const showConfirmPopup = ref(false);
const showDrafts = ref(false);
const draftButtonHidden = ref(false);
const isWriting = ref(false);

function updateDraftPostImages() {
	draftStore.updatePostImages(Array.from(postImageKeys.value.keys()));
}

function editorImageUpdated(updates: any) {
	postImageKeys.value = updates.editorImages;
	updateDraftPostImages();
	if (updates.newImage) {
		const { cid, image, imageName } = updates.newImage;
		preUploadPhoto(cid, image, imageName, sessionStore.id, draft.value.encrypted);
	}
}

function handleEditorError(error: unknown) {
	// $handlError(error)
}

function editorHtml() {
	return editor.value.getInputHTML() as string;
}

function doSave() {
	const title = titleInput.value?.value.trim();
	const subtitle = subtitleInput.value?.value.trim();
	updateContent();
	draftStore.setTimestamp(new Date().getTime());
	if (title && title !== ``) {
		draftStore.setTitle(title);
	}
	if (subtitle && subtitle !== ``) {
		draftStore.setSubtitle(subtitle);
	}
	if (draftStore.draftWidget) {
		draftStore.createNewDraft();
		draftStore.handleDraftWidget(false);
	}
}

function updateContent() {
	draftStore.updateContent(editorHtml(), activeIndex.value);
}

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
	updateTitle(title);
}

function updateTitle(title: string, updateStore = true) {
	if (updateStore) {
		draftStore.setTitle(title);
	}

	const titleQualityCheck = qualityTitle(title);
	if (isError(titleQualityCheck)) {
		if (titleQualityCheck.error === `Please enter a title.`) {
			return;
		}
		titleError.value = titleQualityCheck.error;
	} else {
		titleError.value = ``;
	}
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
	updateSubtitle(subtitle);
}

function updateSubtitle(subtitle: string, updateStore = true) {
	if (updateStore) {
		draftStore.setSubtitle(subtitle);
	}

	const subtitleQualityCheck = qualitySubtitle(subtitle);
	if (isError(subtitleQualityCheck)) {
		subtitleError.value = subtitleQualityCheck.error;
	} else {
		subtitleError.value = ``;
	}
}

function hideDraftButton(value: boolean) {
	const draftButton = document.getElementById(`draftButton`);
	if (!draftButton) {
		return;
	}
	if (value === true) {
		draftButtonHidden.value = true;
		isWriting.value = true;
	} else {
		draftButtonHidden.value = false;
		isWriting.value = false;
	}
}

async function sleep(ms: any) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleSave() {
	isSaving.value = true;
	updateContent();
	await sleep(600);
	showSaved.value = true;
	await sleep(800);
	isSaving.value = false;
	showSaved.value = false;
}

async function saveContent() {
	isSaving.value = true;
	editor.value.updateContent();
	await sleep(600);
	showSaved.value = true;
	await sleep(800);
	isSaving.value = false;
	showSaved.value = false;
	router.go(-1);
}

function updateWordCount(n: number) {
	wordCount.value = n;
	emit(`updateWordCount`, wordCount.value);
}

function closePostPreview() {
	rootStore.toggleDraftPreview(false);
}

function checkPostPreview() {
	showConfirmPopup.value = true;
	rootStore.toggleDraftPreview(false);
}

function checkPost(checksOnly = false) {
	const title = titleInput.value?.value.trim();
	const subtitle = subtitleInput.value?.value.trim();
	if (!title || !subtitle) {
		return false;
	}
	const { category, tags, featuredPhotoCID, featuredPhotoCaption, encrypted } = draft.value;

	// Check for tiers on premium post
	if (draft.value.encrypted && draft.value.accessTiers.length === 0) {
		toastError(`At least one subscription tier must be selected`);
		return false;
	}

	// Check for quality title
	const titleCheck = qualityTitle(title);
	if (isError(titleCheck)) {
		toastError(titleCheck.error);
		return false;
	}

	// Check for subtitle on encrypted posts
	if (encrypted && subtitle === ``) {
		toastError(`Subtitles are required on encrypted premium posts`);
		return false;
	}

	// Check if using a subtitle and is a quality subtitle
	const subtitleCheck = qualitySubtitle(subtitle);
	if (isError(subtitleCheck)) {
		toastError(subtitleCheck.error);
		return false;
	}

	// Check for quality featuredPhotoCaption
	if (featuredPhotoCaption) {
		const featuredPhotoCaptionCheck = qualityFeaturedPhotoCaption(featuredPhotoCaption);
		if (isError(featuredPhotoCaptionCheck)) {
			toastError(featuredPhotoCaptionCheck.error);
			return false;
		}
	}

	if (category === ``) {
		toastError(`Missing category`);
		return false;
	}

	for (const { name } of tags) {
		if (name.replace(/\s/, ``).trim() !== name) {
			toastError(`Tag with spaces is not allowed`);
			return false;
		}
	}

	const clean = turndownService.turndown(editorHtml());
	// Check content quality
	const contentQualityCheck = qualityContent(clean);
	if (isError(contentQualityCheck)) {
		toastError(contentQualityCheck.error);
		return false;
	}
	if (hasPosted.value) {
		return false;
	}
	const postImages = createEditorImageSet(clean, postImageKeys.value);
	if (postImages.size > textLimits.post_images.max) {
		toastError(`Cannot add more than ${textLimits.post_images.max} images in a post`);
		return false;
	}
	if (checksOnly) {
		return true;
	}
	sendPost(title, subtitle, clean, category, tags, featuredPhotoCID, featuredPhotoCaption, postImages);
	return true;
}

async function sendPost(
	title: string,
	subtitle: string,
	content: string,
	category: string,
	tags: Tag[],
	featuredPhotoCID?: string | null,
	featuredPhotoCaption?: string | null,
	postImages?: Map<string, IKeyData | Record<string, unknown>>,
) {
	const isEncrypted = draft.value.encrypted;
	const images = postImages ? Array.from(postImages.keys()) : undefined;

	if (isEncrypted) {
		const p = createEncryptedPost(
			title,
			subtitle,
			content,
			category,
			tags,
			sessionStore.id,
			featuredPhotoCID,
			featuredPhotoCaption,
			images,
		);
		try {
			const tiers = draft.value.accessTiers;
			const cid = await sendEncryptedPost(p, tiers, postImages);
			router.push(`/post/${cid}`);
		} catch (error) {
			console.log(error);
			// handleError(err)
		}
	} else {
		const p = createRegularPost(
			title,
			subtitle === `` ? null : subtitle,
			content,
			category,
			tags,
			sessionStore.id,
			featuredPhotoCID,
			featuredPhotoCaption,
			images,
		);

		try {
			hasPosted.value = true;
			const cid = await sendRegularPost(p);
			// draftStore.resetDraft()
			// settingsStore.setRecentlyPosted(true)
			router.push(`/post/${cid}`);
		} catch (error) {
			hasPosted.value = false;
			// handleError(error)
		}
	}
	showConfirmPopup.value = false;
	//send post to backend from store and redirect to the the published post
	updateContent();
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
	handleTitle(titleInput.value.value);
	updateTitle(titleInput.value.value, false);
	handleSubtitle(subtitleInput.value.value);
	updateSubtitle(subtitleInput.value.value, false);
}

onBeforeMount(async () => {
	const { postImages } = draft.value;
	if (postImages) {
		postImages.forEach((p) => {
			postImageKeys.value.set(p, {});
		});
	}
});

onMounted(() => {
	initDraft();
});

function handleCloseDrafts() {
	showDrafts.value = false;
	initDraft();
	editor.value.setupEditor();
}

watch(activeIndex, () => {
	initDraft();
});

onBeforeUnmount(() => {
	if (isX.value || settingsStore.recentlyPosted || !titleInput.value || !subtitleInput.value) {
		return;
	}
	const title = titleInput.value.value.trim();
	const subtitle = subtitleInput.value.value.trim();
	if (editorHtml().length > 11 || title !== `` || subtitle !== ``) {
		doSave();
	} else {
		draftStore.deleteDraft(draftStore.activeIndex);
	}
});

defineExpose({ checkPost });
</script>

<template>
	<div id="scrollable_content" class="min-h-88 h-88 w-full overflow-y-auto lg:overflow-y-hidden relative p-8">
		<!-- Title, dave, close -->
		<article class="flex flex-col px-2">
			<div
				v-if="!isSaving && router.currentRoute.value.name !== 'Home'"
				class="absolute right-0 top-0 flex flex-row items-center m-8"
			>
				<button class="mr-5 text-primary" @click="handleSave">Save</button>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="saveContent">
					<XIcon />
				</button>
			</div>
			<article
				v-else-if="isSaving && router.currentRoute.value.name !== 'Home'"
				class="modal-animation absolute right-0 top-0 p-8"
			>
				<p v-if="showSaved" class="text-positive modal-animation absolute right-0 top-0 p-8 mr-10">Saved!</p>
				<div
					class="loader border-2 border-gray1 dark:border-gray7 h-6 w-6 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</article>
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
				:initial-editor-images="postImageKeys"
				:valid-image-types="validMimeTypes"
				:image-uploader="uploadPhoto"
				:is-primary-widget="false"
				:allowed-tags="BASE_ALLOWED_TAGS"
				:max-post-images="10"
				:encrypted-content="draft.encrypted"
				@editor-image-updates="editorImageUpdated"
				@update-word-count="updateWordCount"
				@is-writing="hideDraftButton"
				@on-error="handleEditorError"
			/>
		</article>
	</div>
	<div
		id="draftButton"
		class="animatedraftButton bg-lightBG dark:bg-darkBG border-lightBorder text-xs text-gray5 dark:text-gray3 modal-animation card-animation-delay1 absolute bottom-0 z-10 m-4 ml-0 flex rounded-r-lg shadow-lg"
		:class="draftButtonHidden ? `hidedraftButtonclass px-3 py-2.5` : `showraftButtonclass py-3 px-5`"
		@mouseenter="draftButtonHidden = false"
		@mouseleave="isWriting ? (draftButtonHidden = true) : ``"
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
.hidedraftButtonclass {
	transform: translateX(-0.8rem);
}
.showdraftButtonclass {
	transform: translateX(0rem);
}
</style>
