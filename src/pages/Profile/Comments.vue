<script setup lang="ts">
import Comment from '@/components/post/comments/Comment.vue';
</script>

<template>
	<div
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 overflow-y-auto lg:overflow-y-hidden relative w-full px-4"
	>
		<div v-for="i in 50" :key="i"><Comment class="mb-4" /></div>
	</div>
</template>
