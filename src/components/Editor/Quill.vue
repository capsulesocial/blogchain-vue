<script setup lang="ts">
import DOMPurify from 'dompurify';
import type { RangeStatic, Quill } from 'quill';
// import type { PropType } from 'vue';
import QuillMarkdown from 'quilljs-markdown';
import hljs from 'highlight.js';
import turndownService from '@/helpers/turndownService';
import EditorActions from '@/components/Editor/EditorActions.vue';
import {
	getBlobExtension,
	getContentImages,
	InsertContent,
	isError,
	createEditorImageSet,
	counterModuleFactory,
	ImageBlotFactory,
	EditorImages,
} from '@/helpers/editor';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { handleError } from '@/plugins/toast';
import { useDraftStore } from '@/store/drafts';

const toolbarOptions = [
	[`bold`, `italic`, `underline`, `strike`],
	[`blockquote`, `code-block`, `link`],
	[{ header: 2 }],
	[{ list: `ordered` }, { list: `bullet` }],
];

const options = {
	placeholder: `Start typing here...`,
	readOnly: false,
	theme: `bubble`,
	bounds: `#editor`,
	scrollingContainer: `#editor`,
	modules: {
		syntax: {
			highlight: (code: string) => hljs.highlightAuto(code).value,
		},
		counter: true,
		toolbar: {
			container: toolbarOptions,
		},
	},
};

defineExpose({ updateContent, setupEditor });
const emit = defineEmits([`onError`, `isWriting`, `editorImageUpdates`]);

const props = withDefaults(
	defineProps<{
		initialContent: string;
		initialEditorImages?: Map<string, EditorImages> | null;
		validImageTypes: string[] | undefined;
		imageUploader: (file: File, encrypt?: boolean) => Promise<any>;
		isPrimaryWidget?: boolean;
		allowedTags: string[];
		maxPostImages?: number;
		encryptedContent?: boolean;
	}>(),
	{
		initialEditorImages: null,
		isPrimaryWidget: false,
		maxPostImages: 10,
		encryptedContent: false,
	},
);

const draftStore = useDraftStore();
const toggleAddContent = ref(false);
const addContentPosTop = ref(0);
const addContentPosLeft = ref(0);
const waitingImage = ref(false);
const qeditor = ref<Quill>();
const editor = ref<QuillMarkdown>();
const editorImages = ref(new Map());

async function handleCutPaste(range: RangeStatic, pastedText: string) {
	const { default: QuillClass } = await import(`quill`);
	const Delta = QuillClass.import(`delta`);
	const delta = new Delta().compose(new Delta().retain(range.index + range.length).insert(pastedText));
	qeditor.value?.updateContents(delta);
	setTimeout(() => qeditor.value?.setSelection(range.index + pastedText.length, 0, `user`), 0);
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

async function urlToFile(url: string): Promise<{ file: File } | { error: string }> {
	try {
		const response = await fetch(url, { mode: `cors` });
		if (!response.ok) {
			return { error: `Could not fetch image` };
		}
		const blob = await response.blob();
		const blobExtension = getBlobExtension(blob);
		if (!blobExtension) {
			return { error: `Invalid image type` };
		}
		const file = new File([blob], `image${Date.now()}${blobExtension}`, { type: blob.type });
		return { file };
	} catch (error: any) {
		emit(`onError`, error);
		return { error: error.message };
	}
}

function sanitize(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: props.allowedTags,
	});
}

function actionsUpload() {
	document.getElementById(`getFile`)?.click();
}

function getInputHTML(): string {
	const input = qeditor.value?.root.innerHTML;
	if (!input) {
		return ``;
	}
	// Sanitize HTML
	return sanitize(input);
}

function updateContent() {
	const editorHtml = getInputHTML();
	if (editorHtml !== ``) {
	}
	draftStore.updateContent(editorHtml, draftStore.activeIndex);
}

function calculateAddPos(index: number) {
	if (!qeditor.value) {
		return;
	}
	const line = qeditor.value.getLine(index);
	const pos = qeditor.value.getBounds(index);
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
		if (!qeditor.value || !content) {
			return;
		}
		const range = qeditor.value.getSelection(true);
		if (typeof content === `string`) {
			if (plainText) {
				qeditor.value.insertText(range.index, content, `user`);
			} else {
				qeditor.value.clipboard.dangerouslyPasteHTML(range.index, content, `user`);
			}
		} else {
			const { cid, url } = content;
			qeditor.value.insertEmbed(range.index, `image`, { alt: cid.toString(), url }, `user`);
		}
		const contentLength = qeditor.value.getContents().length();
		setTimeout(() => {
			qeditor.value?.setSelection(contentLength, 0, `user`);
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
	encryptionData?: { key: string; counter: string },
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
	editorImages.value.set(cid, encryptionData ?? {});
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
		const res = await props.imageUploader(file, props.encryptedContent);
		const { cid, url, image, imageName } = res;
		const updatedPostImages = updatePostImages(cid, image, imageName);
		if (isError(updatedPostImages)) {
			emit(`onError`, new Error(updatedPostImages.error));
			waitingImage.value = false;
			return;
		}
		insertContent({ cid, url });
		waitingImage.value = false;
	} catch (err: unknown) {
		waitingImage.value = false;
		handleError(err);
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
			const res = await props.imageUploader(f.file, props.encryptedContent);
			const { cid, url, image, imageName } = res;
			const updatedPostImages = updatePostImages(cid, image, imageName);
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

async function handlePastedContent(e: ClipboardEvent) {
	e.stopPropagation();
	e.preventDefault();

	if (!qeditor.value) {
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
	const range = qeditor.value.getSelection(true);

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

	// handle cut and paste
	if (qeditor.value.getLength() !== range.index + 1 && contentImgs.length === 0 && !pastedFile) {
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
		if (qeditor.value && source === `user`) {
			const currentContent = qeditor.value.getContents();
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
		draftStore.updateWordCount(n);
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
	const e = new QuillClass(`#editor`, options);
	qeditor.value = e;
	qeditor.value.root.addEventListener(`drop`, (ev: DragEvent) => {
		handleDroppedContent(ev);
	});
	qeditor.value.root.addEventListener(`paste`, (ev: ClipboardEvent) => {
		handlePastedContent(ev);
	});
	qeditor.value.focus();
	// Set link placeholder
	const qe: HTMLElement | null = document.querySelector(`.ql-tooltip-editor input`);
	if (qe) {
		qe.setAttribute(`data-link`, `https://capsule.social`);
	}
	editor.value = new QuillMarkdown(e, {});
}

onMounted(() => {
	if (props.initialEditorImages) {
		editorImages.value = props.initialEditorImages;
	}
	setupEditor();
});

onBeforeUnmount(() => {
	updateContent();
});
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
