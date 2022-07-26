<script setup lang="ts">
import DOMPurify from 'dompurify';
import type { RangeStatic, Quill } from 'quill';
import QuillMarkdown from 'quilljs-markdown';
import turndownService from './TurndownService';
import EditorActions from './EditorActions.vue';
import {
	urlToFile,
	getContentImages,
	InsertContent,
	isError,
	createEditorImageSet,
	counterModuleFactory,
	ImageBlotFactory,
	EditorImages,
} from './helpers';
import { computed, onMounted, ref } from 'vue';
import { quillOptions } from './helpers';
import { useDraftStore } from '@/store/drafts';

const emit = defineEmits([`onError`, `isWriting`, `editorImageUpdates`, `updateWordCount`]);

const props = withDefaults(
	defineProps<{
		initialContent: string;
		initialEditorImages: EditorImages;
		validImageTypes: string[];
		imageUploader: (file: File, encrypt?: boolean) => Promise<any>;
		allowedTags: string[];
		maxPostImages?: number;
	}>(),
	{
		maxPostImages: 10,
	},
);

const toggleAddContent = ref(false);
const addContentPosTop = ref(0);
const addContentPosLeft = ref(0);
const waitingImage = ref(false);
let qeditor: Quill | null = null;
let editor: QuillMarkdown | null = null;
const editorImages = ref(new Map());
const draftStore = useDraftStore();
const encryptedContent = computed(() => draftStore.$state.drafts[draftStore.activeIndex].encrypted);

async function handleCutPaste(range: RangeStatic, pastedText: string) {
	const { default: QuillClass } = await import(`quill`);
	const Delta = QuillClass.import(`delta`);
	const delta = new Delta().compose(new Delta().retain(range.index + range.length).insert(pastedText));
	qeditor?.updateContents(delta);
	setTimeout(() => qeditor?.setSelection(range.index + pastedText.length, 0, `user`), 0);
}

async function handleImage(e: Event) {
	e.stopPropagation();
	e.preventDefault();
	const eventTarget = e.target;
	if (!eventTarget) {
		return;
	}
	const target = eventTarget as HTMLInputElement;
	const { files } = target;
	if (!files || files.length !== 1) {
		return;
	}
	await handleFile(files[0]);
	target.value = ``;
}

function sanitize(html: string) {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: props.allowedTags,
	});
}

function actionsUpload() {
	document.getElementById(`getFile`)?.click();
}

function getInputHTML(): string {
	const input = qeditor?.root.innerHTML;
	if (!input) {
		return ``;
	}
	// Sanitize HTML
	return sanitize(input);
}

function calculateAddPos(index: number) {
	if (!qeditor) {
		return;
	}
	const line = qeditor.getLine(index);
	const pos = qeditor.getBounds(index);
	if (line[1] === 0 && line[0].domNode.innerHTML === `<br>` && !waitingImage.value) {
		if (index === 0) {
			addContentPosTop.value = pos.top + 50;
			addContentPosLeft.value = pos.left;
		} else {
			addContentPosTop.value = pos.top;
			addContentPosLeft.value = pos.left + 20;
		}
		toggleAddContent.value = true;
	} else {
		toggleAddContent.value = false;
	}
}

function insertContent(content: InsertContent | null, plainText = false) {
	try {
		if (!qeditor || !content) {
			return;
		}
		const range = qeditor.getSelection(true);
		if (typeof content === `string`) {
			if (plainText) {
				qeditor.insertText(range.index, content, `user`);
			} else {
				qeditor.clipboard.dangerouslyPasteHTML(range.index, content, `user`);
			}
		} else {
			const { cid, url } = content;
			qeditor.insertEmbed(range.index, `image`, { alt: cid.toString(), url }, `user`);
		}
		const contentLength = qeditor.getContents().length();
		setTimeout(() => {
			qeditor?.setSelection(contentLength, 0, `user`);
			calculateAddPos(contentLength);
		}, 0);
	} catch (error: any) {
		emit(`onError`, error);
	}
}

function updatePostImages(
	cid: string,
	image: Blob,
	imageName: string,
	encryptionData: { key: string; counter: string } | Record<string, unknown>,
): { error: string } | { success: boolean } {
	if (!editorImages.value) {
		return { error: `no images in the editor` };
	}
	// If we have already added this image in the past, we don't need to reupload it to the server
	if (editorImages.value.has(cid)) {
		return { success: true };
	}
	if (editorImages.value.size === props.maxPostImages) {
		waitingImage.value = false;
		return { error: `Cannot add more than ${props.maxPostImages} images in a post` };
	}
	editorImages.value.set(cid, encryptionData);
	emit(`editorImageUpdates`, {
		editorImages: editorImages.value,
		newImage: { cid, image, imageName },
	});
	return { success: true };
}

async function handleFile(file: File) {
	if (props.validImageTypes && !props.validImageTypes.includes(file.type)) {
		emit(`onError`, new Error(`image of type ${file.type} is invalid`));
		return;
	}
	try {
		waitingImage.value = true;
		toggleAddContent.value = false;
		const res = await props.imageUploader(file, encryptedContent.value);
		const { cid, url, image, imageName, key, counter } = res;
		const updatedPostImages = updatePostImages(cid, image, imageName, encryptedContent.value ? { counter, key } : {});
		if (isError(updatedPostImages)) {
			emit(`onError`, new Error(updatedPostImages.error));
			waitingImage.value = false;
			return;
		}
		insertContent({ cid, url });
		waitingImage.value = false;
	} catch (err: unknown) {
		waitingImage.value = false;
		emit(`onError`, err);
	}
}

async function handleHtml(pastedContent: string) {
	const domParser = new DOMParser();
	const content = domParser.parseFromString(pastedContent, `text/html`);
	const contentImgs = content.getElementsByTagName(`img`);
	if (contentImgs.length > props.maxPostImages) {
		waitingImage.value = false;
		emit(`onError`, new Error(`Cannot add more than ${props.maxPostImages} images in a post`));
		return null;
	}
	for (const img of contentImgs) {
		waitingImage.value = true;
		toggleAddContent.value = false;
		const f = await urlToFile(img.src);
		if (isError(f)) {
			emit(`onError`, new Error(f.error));
			img.remove();
			continue;
		}
		try {
			const res = await props.imageUploader(f.file, encryptedContent.value);
			const { cid, url, image, imageName, key, counter } = res;
			const updatedPostImages = updatePostImages(cid, image, imageName, encryptedContent.value ? { key, counter } : {});
			if (isError(updatedPostImages)) {
				emit(`onError`, new Error(updatedPostImages.error));
				return null;
			}
			const newImg = document.createElement(`img`);
			newImg.setAttribute(`src`, url.toString());
			newImg.setAttribute(`alt`, cid);
			img.replaceWith(newImg);
		} catch (err: any) {
			waitingImage.value = false;
			emit(`onError`, err);
			return null;
		}
	}
	waitingImage.value = false;
	return content.body.innerHTML;
}

async function handleDroppedContent(e: DragEvent) {
	e.stopPropagation();
	e.preventDefault();
	if (!e.dataTransfer) {
		return;
	}
	const droppedHtml = sanitize(e.dataTransfer.getData(`text/html`));
	const droppedText = sanitize(e.dataTransfer.getData(`text/plain`));
	const { files } = e.dataTransfer;
	const file = files[0];

	// handle dropped file
	if (file) {
		await handleFile(file);
		return;
	}

	if (!file && (droppedHtml || droppedHtml !== ``)) {
		const content = await handleHtml(droppedHtml);
		insertContent(content);
		return;
	}

	if (!file && !droppedHtml) {
		insertContent(droppedText, true);
	}
}

function scrollToBottom(e: ClipboardEvent) {
	const scrollContainer = document.getElementById(`editor`);
	if (e && e.target && scrollContainer) {
		const target = e.target as HTMLElement;
		if (target.outerHTML === `<br>`) {
			scrollContainer.scrollTop = addContentPosTop.value;
			return;
		}

		target.scrollIntoView();
	}
}

async function handlePastedContent(e: ClipboardEvent) {
	e.stopPropagation();
	e.preventDefault();

	if (!qeditor) {
		emit(`onError`, new Error(`Something went wrong while pasting the content`));
		return;
	}
	if (!e.clipboardData) {
		return;
	}
	const clipboard = e.clipboardData;
	const items = Array.from(clipboard.items);
	const pastedContent = sanitize(clipboard.getData(`text/html`));
	const pastedText = sanitize(clipboard.getData(`text/plain`));
	const pastedFile = items.length > 0 ? items[0].getAsFile() : null;
	const contentImgs = getContentImages(pastedContent);
	const range = qeditor.getSelection(true);

	// handle cut and paste
	if (qeditor.getLength() !== range.index + 1 && contentImgs.length === 0 && !pastedFile) {
		handleCutPaste(range, pastedText);
		scrollToBottom(e);
		return;
	}

	// handle pasted content
	if (pastedContent || pastedContent !== ``) {
		const content = await handleHtml(pastedContent);
		insertContent(content);
		scrollToBottom(e);
		return;
	}

	// handle pasted file
	if (pastedFile) {
		await handleFile(pastedFile);
		return;
	}
	// handle if text only
	if (!pastedFile && (!pastedContent || pastedContent === ``)) {
		insertContent(pastedText, true);
	}
	scrollToBottom(e);
}

async function setupEditor(this: any) {
	const { default: QuillClass } = await import(`quill`);
	const Link = QuillClass.import(`formats/link`);
	const builtInFunc = Link.sanitize;
	// Handle link validation
	Link.sanitize = function customSanitizeLinkInput(linkValueInput: string) {
		let val = linkValueInput;
		if (/^\w+:/.test(val)) {
			// do nothing, since this implies user's already using a custom protocol
		} else if (!/^https?:/.test(val)) {
			val = `https://` + val;
		}
		return builtInFunc.call(this, val); // retain the built-in logic
	};
	// Handle updates to body
	const onTextChange = (_delta?: any, oldDelta?: any, source?: string) => {
		if (qeditor && source === `user`) {
			const currentContent = qeditor.getContents();
			const diff = currentContent.diff(oldDelta);
			const imageInCurrentContent = currentContent.ops.find((op: any) => op.insert && op.insert.image);
			const imageInDiff = diff.ops.find((op: any) => op.insert && op.insert.image);
			if ((imageInCurrentContent || imageInDiff) && editorImages.value) {
				const clean = turndownService.turndown(getInputHTML());
				editorImages.value = createEditorImageSet(clean, editorImages.value);
				emit(`editorImageUpdates`, { editorImages: editorImages.value });
			}
		}
		emit(`isWriting`, true);
		const text = getInputHTML().replace(/(<([^>]+)>)/gi, ` `);
		const n = text.split(/\s+/).length;
		emit(`updateWordCount`, n);
	};
	// Handles draft overlay
	const onSelectionChange = (range: RangeStatic) => {
		if (!range) {
			emit(`isWriting`, false);
		}
	};
	// Handles add content button
	const onEditorChange = (eventName: string, ...args: any[]) => {
		if (eventName === `selection-change`) {
			if (!args[0]) {
				toggleAddContent.value = false;
				return;
			}
			calculateAddPos(args[0].index);
		}
	};

	QuillClass.register(ImageBlotFactory(QuillClass), true);
	QuillClass.register(
		`modules/counter`,
		counterModuleFactory(QuillClass, onTextChange.bind(this), onSelectionChange.bind(this), onEditorChange.bind(this)),
		true,
	);
	const e = new QuillClass(`#editor`, quillOptions);
	qeditor = e;
	qeditor.root.addEventListener(`drop`, (ev: DragEvent) => {
		handleDroppedContent(ev);
	});
	qeditor.root.addEventListener(`paste`, (ev: ClipboardEvent) => {
		handlePastedContent(ev);
	});
	qeditor.focus();
	// Set link placeholder
	const qe: HTMLElement | null = document.querySelector(`.ql-tooltip-editor input`);
	if (qe) {
		qe.setAttribute(`data-link`, `https://capsule.social`);
	}
	editor = new QuillMarkdown(e, {});
}

onMounted(() => {
	if (props.initialEditorImages) {
		editorImages.value = props.initialEditorImages;
	}
	setupEditor();
});

defineExpose({ getInputHTML, setupEditor });
</script>

<template>
	<div id="qeditor" class="relative flex justify-center">
		<input v-show="false" id="getFile" accept="image/png, image/jpeg" type="file" @change="handleImage($event)" />
		<div
			id="editor"
			class="editable focus:outline-none content max-w-none p-2 dark:placeholder-gray2 dark:text-darkPrimaryText w-full"
			v-html="sanitize(initialContent)"
		></div>
		<EditorActions
			v-show="toggleAddContent"
			class="absolute modal-animation"
			:style="`top:` + addContentPosTop + `px;` + `left:` + addContentPosLeft + `px`"
			@image="actionsUpload"
		/>
		<div
			v-if="waitingImage"
			class="absolute w-11/12 h-44 bg-lightInput dark:bg-gray7 rounded-lg animate-pulse flex justify-center items-center"
			:style="`top:` + addContentPosTop + `px`"
		>
			<p class="text-sm text-gray5 dark:text-gray3">Uploading image...</p>
		</div>
	</div>
</template>

<style>
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
