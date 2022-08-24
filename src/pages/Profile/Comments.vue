<script setup lang="ts">
import { useMeta } from 'vue-meta';
useMeta({
	title: `authorName - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});
</script>

<template>
	<div id="scrollable_content">{{ $route.params }}/comments</div>
</template>
