/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.webp" {
  // eslint-disable-next-line init-declarations
  const value: string;
  export default value;
}

declare module "*.png" {
  // eslint-disable-next-line init-declarations
  const value: string;
  export default value;
}
declare module 'turndown-plugin-gfm' {
	// eslint-disable-next-line init-declarations
	const strikethrough: any
	export { strikethrough }
}

declare module 'quilljs-markdown' {
	import { Quill } from 'quill'
	export default class QuillMarkdown extends Quill {
		constructor(editor: Quill, options: any)
	}
}

