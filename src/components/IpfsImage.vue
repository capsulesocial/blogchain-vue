<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getPhotoFromIPFS, isValidPhoto } from '@/backend/getPhoto';

import { toastError } from '@/plugins/toast';

const imageSrc = ref<string | null>(null);

const props = withDefaults(
	defineProps<{
		cid: string | null;
		imgClass: string;
		defaultImage: string | null | ArrayBuffer;
	}>(),
	{
		cid: null,
		imgClass: ``,
		defaultImage: null,
	},
);

onMounted(async () => {
	if (props.defaultImage) {
		imageSrc.value = props.defaultImage;
	}
	if (props.cid) {
		const dataUrl = await getPhotoFromIPFS(props.cid);
		if (!isValidPhoto(dataUrl)) {
			toastError(`Invalid image with cid: ${props.cid}`);
			return;
		}
		imageSrc.value = dataUrl;
	}
});
</script>
<template>
	<div v-if="imageSrc !== null" class="modal-animation">
		<img v-lazy="imageSrc" :class="imgClass + ' object-cover'" />
	</div>
	<div v-else class="animate-pulse bg-gray1 dark:bg-gray7"></div>
</template>
