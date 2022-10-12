<script setup lang="ts">
import DOMPurify from 'dompurify';
// import type { RangeStatic, Quill } from 'quill';
// import type { PropType } from 'vue';
// import QuillMarkdown from 'quilljs-markdown';
import hljs from 'highlight.js';
// import turndownService from './TurndownService';
import EditorActions from './EditorActions.vue';
import {
	getBlobExtension,
	// getContentImages,
	// InsertContent,
	// isError,
	// createEditorImageSet,
	// counterModuleFactory,
	// ImageBlotFactory,
	EditorImages,
} from '@/helpers/editor';
import { onMounted, ref } from 'vue';

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

const emit = defineEmits([`onError`]);

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

const toggleAddContent = ref(false);
const addContentPosTop = ref(0);
const addContentPosLeft = ref(0);
const waitingImage = ref(false);
const qeditor = ref(null);
const editor = ref(null);
const editorImages = ref(new Map());

function setupEditor() {}

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

async function setupEditor() {
	const { default: QuillClass } = await import(`quill`);
	const Link = QuillClass.import(`formats/link`);
	const builtInFunc = Link.sanitize;
}

export default Vue.extend({
	methods: {
		async setupEditor() {
			// Handle link validation
			const { default: QuillClass } = await import(`quill`);
			const Link = QuillClass.import(`formats/link`);
			const builtInFunc = Link.sanitize;
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
				if (this.qeditor && source === `user`) {
					const currentContent = this.qeditor.getContents();
					const diff = currentContent.diff(oldDelta);
					const imageInCurrentContent = currentContent.ops.find((op: any) => op.insert && op.insert.image);
					const imageInDiff = diff.ops.find((op: any) => op.insert && op.insert.image);
					if ((imageInCurrentContent || imageInDiff) && this.editorImages) {
						const clean = turndownService.turndown(this.getInputHTML());
						this.editorImages = createEditorImageSet(clean, this.editorImages);
						this.$emit(`editorImageUpdates`, { editorImages: this.editorImages });
					}
				}
				this.$emit(`isWriting`, true);
				const text = this.getInputHTML().replace(/(<([^>]+)>)/gi, ` `);
				const n = text.split(/\s+/).length;
				this.$emit(`updateWordCount`, n);
			};
			// Handles draft overlay
			const onSelectionChange = (range: RangeStatic) => {
				if (!range) {
					this.$emit(`isWriting`, false);
				}
			};
			// Handles add content button
			const onEditorChange = (eventName: string, ...args: any[]) => {
				if (eventName === `selection-change`) {
					if (!args[0]) {
						this.toggleAddContent = false;
						return;
					}
					this.calculateAddPos(args[0].index);
				}
			};

			QuillClass.register(ImageBlotFactory(QuillClass), true);
			QuillClass.register(
				`modules/counter`,
				counterModuleFactory(
					QuillClass,
					onTextChange.bind(this),
					onSelectionChange.bind(this),
					onEditorChange.bind(this),
				),
				true,
			);
			const editor = new QuillClass(`#editor`, options);
			this.qeditor = editor;
			this.qeditor.root.addEventListener(`drop`, (ev: DragEvent) => {
				this.handleDroppedContent(ev);
			});
			this.qeditor.root.addEventListener(`paste`, (ev: ClipboardEvent) => {
				this.handlePastedContent(ev);
			});
			this.qeditor.focus();
			// Set link placeholder
			const qe: HTMLElement | null = document.querySelector(`.ql-tooltip-editor input`);
			if (qe) {
				qe.setAttribute(`data-link`, `https://capsule.social`);
			}
			this.editor = new QuillMarkdown(editor, {});
		},
		updatePostImages(
			cid: string,
			image: Blob,
			imageName: string,
			encryptionData?: { key: string; counter: string },
		): { error: string } | { success: boolean } {
			if (!this.editorImages) {
				return { error: `no images in the editor` };
			}
			// If we have already added this image in the past, we don't need to reupload it to the server
			if (this.editorImages.has(cid)) {
				return { success: true };
			}
			if (this.editorImages.size === this.maxPostImages) {
				this.waitingImage = false;
				return { error: `Cannot add more than ${this.maxPostImages} images in a post` };
			}
			this.editorImages.set(cid, encryptionData ?? {});
			this.$emit(`editorImageUpdates`, {
				editorImages: this.editorImages,
				newImage: { cid, image, imageName },
			});
			return { success: true };
		},
		async handleHtml(pastedContent: string) {
			const domParser = new DOMParser();
			const content = domParser.parseFromString(pastedContent, `text/html`);
			const contentImgs = content.getElementsByTagName(`img`);
			if (contentImgs.length > this.maxPostImages) {
				this.waitingImage = false;
				this.$emit(`onError`, new Error(`Cannot add more than ${this.maxPostImages} images in a post`));
				return null;
			}
			for (const img of contentImgs) {
				this.waitingImage = true;
				this.toggleAddContent = false;
				const f = await this.urlToFile(img.src);
				if (isError(f)) {
					this.$emit(`onError`, new Error(f.error));
					img.remove();
					continue;
				}
				try {
					const res = await this.imageUploader(f.file, this.encryptedContent);
					const { cid, url, image, imageName } = res;
					const updatedPostImages = this.updatePostImages(cid, image, imageName);
					if (isError(updatedPostImages)) {
						this.$emit(`onError`, new Error(updatedPostImages.error));
						return null;
					}
					const newImg = document.createElement(`img`);
					newImg.setAttribute(`src`, url.toString());
					newImg.setAttribute(`alt`, cid);
					img.replaceWith(newImg);
				} catch (err: any) {
					this.waitingImage = false;
					this.$emit(`onError`, err);
					return null;
				}
			}
			this.waitingImage = false;
			return content.body.innerHTML;
		},
		async handleImage(e: Event) {
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

			await this.handleFile(files[0]);
			target.value = ``;
		},
		insertContent(content: InsertContent | null, plainText = false) {
			try {
				if (!this.qeditor || !content) {
					return;
				}
				const range = this.qeditor.getSelection(true);
				if (typeof content === `string`) {
					if (plainText) {
						this.qeditor.insertText(range.index, content, `user`);
					} else {
						this.qeditor.clipboard.dangerouslyPasteHTML(range.index, content, `user`);
					}
				} else {
					const { cid, url } = content;
					this.qeditor.insertEmbed(range.index, `image`, { alt: cid.toString(), url }, `user`);
				}
				const contentLength = this.qeditor.getContents().length();
				setTimeout(() => {
					this.qeditor?.setSelection(contentLength, 0, `user`);
					this.calculateAddPos(contentLength);
				}, 0);
			} catch (error: any) {
				this.$emit(`onError`, error);
			}
		},
		async handleFile(file: File) {
			if (this.validImageTypes && !this.validImageTypes.includes(file.type)) {
				this.$emit(`onError`, new Error(`image of type ${file.type} is invalid`));
				return;
			}
			try {
				this.waitingImage = true;
				this.toggleAddContent = false;
				const res = await this.imageUploader(file, this.encryptedContent);
				const { cid, url, image, imageName } = res;
				const updatedPostImages = this.updatePostImages(cid, image, imageName);
				if (isError(updatedPostImages)) {
					this.$emit(`onError`, new Error(updatedPostImages.error));
					this.waitingImage = false;
					return;
				}
				this.insertContent({ cid, url });
				this.waitingImage = false;
			} catch (err: unknown) {
				this.waitingImage = false;
				this.$handleError(err);
			}
		},
		async handleDroppedContent(e: DragEvent) {
			e.stopPropagation();
			e.preventDefault();
			if (!e.dataTransfer) {
				return;
			}
			const droppedHtml = this.sanitize(e.dataTransfer.getData(`text/html`));
			const droppedText = this.sanitize(e.dataTransfer.getData(`text/plain`));
			const { files } = e.dataTransfer;
			const file = files[0];

			// handle dropped file
			if (file) {
				await this.handleFile(file);
				return;
			}

			if (!file && (droppedHtml || droppedHtml !== ``)) {
				const content = await this.handleHtml(droppedHtml);
				this.insertContent(content);
				return;
			}

			if (!file && !droppedHtml) {
				this.insertContent(droppedText, true);
			}
		},
		async handleCutPaste(range: RangeStatic, pastedText: string) {
			const { default: QuillClass } = await import(`quill`);
			const Delta = QuillClass.import(`delta`);
			const delta = new Delta().compose(new Delta().retain(range.index + range.length).insert(pastedText));
			this.qeditor?.updateContents(delta);
			setTimeout(() => this.qeditor?.setSelection(range.index + pastedText.length, 0, `user`), 0);
		},
		scrollToBottom(e: ClipboardEvent) {
			const scrollContainer = document.getElementById(`editor`);
			if (e && e.target && scrollContainer) {
				const target = e.target as HTMLElement;
				if (target.outerHTML === `<br>`) {
					scrollContainer.scrollTop = this.addContentPosTop;
					return;
				}

				target.scrollIntoView();
			}
		},
		async handlePastedContent(e: ClipboardEvent) {
			e.stopPropagation();
			e.preventDefault();

			if (!this.qeditor) {
				this.$emit(`onError`, new Error(`Something went wrong while pasting the content`));
				return;
			}
			if (!e.clipboardData) {
				return;
			}
			const clipboard = e.clipboardData;
			const items = Array.from(clipboard.items);
			const pastedContent = this.sanitize(clipboard.getData(`text/html`));
			const pastedText = this.sanitize(clipboard.getData(`text/plain`));
			const pastedFile = items.length > 0 ? items[0].getAsFile() : null;
			const contentImgs = getContentImages(pastedContent);
			const range = this.qeditor.getSelection(true);

			// handle cut and paste
			if (this.qeditor.getLength() !== range.index + 1 && contentImgs.length === 0 && !pastedFile) {
				this.handleCutPaste(range, pastedText);
				this.scrollToBottom(e);
				return;
			}

			// handle pasted content
			if (pastedContent || pastedContent !== ``) {
				const content = await this.handleHtml(pastedContent);
				this.insertContent(content);
				this.scrollToBottom(e);
				return;
			}

			// handle pasted file
			if (pastedFile) {
				await this.handleFile(pastedFile);
				return;
			}
			// handle if text only
			if (!pastedFile && (!pastedContent || pastedContent === ``)) {
				this.insertContent(pastedText, true);
			}
			this.scrollToBottom(e);
		},
	},
});

onMounted(() => {
	if (props.initialEditorImages) {
		editorImages.value = props.initialEditorImages;
	}
	setupEditor();
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
