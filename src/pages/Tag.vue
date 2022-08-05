<script setup lang="ts">
import { useMeta } from 'vue-meta';
useMeta({
	title: `dynamicTag posts on Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});
</script>

<template>{{ $route.params }}</template>
