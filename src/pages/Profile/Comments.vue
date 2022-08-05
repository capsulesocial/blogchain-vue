<script setup lang="ts">
import { useMeta } from 'vue-meta';
useMeta({
	title: `authorName - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});
</script>

<template>{{ $route.params }}/comments</template>
