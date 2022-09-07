<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getPost } from '@/backend/post';
import type { Post } from '@/backend/post';
const router = useRouter();
const post = ref<Post>();

// Fetch post
onBeforeMount(async () => {
	const cid = ref<string>(router.currentRoute.value.params.post as string);
	try {
		const res = await (await getPost(cid.value)).data;
		if (!res) {
			return;
		}
		post.value = res;
	} catch (err) {
		throw new Error(err as string);
	}
});
</script>
<template>
	<div id="scrollable_content">{{ post }}</div>
</template>
