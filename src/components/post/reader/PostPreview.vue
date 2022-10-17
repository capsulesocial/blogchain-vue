<script setup lang="ts">
import { onMounted, computed } from 'vue';
import hljs from 'highlight.js';
import { afterSanitizeAttrsHook, BASE_ALLOWED_ATTRS, BASE_ALLOWED_TAGS, sanitizeHtml } from '@/helpers/helpers';

const ALLOWED_TAGS = BASE_ALLOWED_TAGS;
const ALLOWED_ATTR = [...BASE_ALLOWED_ATTRS, `src`];

const props = defineProps<{
	content: string;
}>();

const htmlContent = computed(() => sanitizeHtml(props.content, ALLOWED_TAGS, ALLOWED_ATTR));

afterSanitizeAttrsHook();

// methods
onMounted(async () => {
	document.querySelectorAll(`pre`).forEach((block) => {
		hljs.highlightBlock(block);
	});
});
</script>
<template>
	<div>
		<div v-html="htmlContent"></div>
	</div>
</template>
<style>
@import 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/monokai-sublime.min.css';
.editable img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}
pre {
	white-space: pre-wrap;
	margin-bottom: 5px;
	margin-top: 5px;
	padding: 5px 10px;
	border-radius: 3px;
}
pre.ql-syntax {
	background-color: rgb(35, 36, 31);
	color: rgb(248, 248, 242);
	overflow: visible;
}
</style>
