import hljs from 'highlight.js';
import type { RangeStatic, Quill } from 'quill';

export type InsertContent = string | { cid: string; url: string | ArrayBuffer };
export type EditorImages = Map<string, { key: string; counter: string } | Record<string, unknown>>;

export const quillToolbarOptions = [
	[`bold`, `italic`, `underline`, `strike`],
	[`blockquote`, `code-block`, `link`],
	[{ header: 2 }],
	[{ list: `ordered` }, { list: `bullet` }],
];

export const quillOptions = {
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
			container: quillToolbarOptions,
		},
	},
};

export function getContentImages(content: string) {
	const domParser = new DOMParser();
	const htmlDoc = domParser.parseFromString(content, `text/html`);

	return htmlDoc.getElementsByTagName(`img`);
}

export function getBlobExtension(blob: Blob) {
	switch (blob.type) {
		case `image/png`:
			return `.png`;
		case `image/jpeg`:
			return `.jpeg`;
		case `image/jpg`:
			return `.jpg`;
		case `image/avif`:
			return `.avif`;
		case `image/webp`:
			return `.webp`;
		default:
			return null;
	}
}

export function isError(obj: Record<string, unknown>): obj is { error: string } {
	return `error` in obj;
}

export function counterModuleFactory(
	QuillClass: typeof Quill,
	onTextChange: () => void,
	onSelectionChange: (range: RangeStatic) => void,
	onEditorChange: (eventName: string, ...args: any[]) => void,
) {
	const Module = QuillClass.import(`core/module`);
	return class CounterModule extends Module {
		constructor(quill: Quill) {
			super();
			quill.on(`text-change`, onTextChange);
			quill.on(`selection-change`, onSelectionChange);
			quill.on(`editor-change`, onEditorChange);
		}
	};
}

export function ImageBlotFactory(QuillClass: typeof Quill) {
	const BlockEmbed = QuillClass.import(`blots/block/embed`);
	return class ImageBlot extends BlockEmbed {
		static blotName = `image`;
		static tagName = `img`;

		static create(value: { alt: string; url: string; ipfsimage: string }) {
			const node = super.create();
			node.setAttribute(`alt`, value.alt);
			node.setAttribute(`src`, value.url);
			return node;
		}

		static value(node: { getAttribute: (arg0: string) => any }) {
			return {
				alt: node.getAttribute(`alt`),
				url: node.getAttribute(`src`),
			};
		}
	};
}

const imgRegexp = (cid: string) =>
	new RegExp(`<ipfsimage ((alt="${cid}" cid="${cid}")|(cid="${cid}" alt="${cid}"))></ipfsimage>`, `g`);

export function createEditorImageSet(content: string, uploadedImages: EditorImages) {
	const usedImages: EditorImages = new Map();
	uploadedImages.forEach((val, cid) => {
		if (!content.match(imgRegexp(cid))) {
			return;
		}
		usedImages.set(cid, val);
	});

	return usedImages;
}
