<template>
	<div v-if="imageSrc !== null" class="modal-animation">
		<img v-lazy="imageSrc" :class="imgClass + ' object-cover'" />
	</div>
	<div v-else class="animate-pulse bg-gray1 dark:bg-gray7"></div>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';

import { getPhotoFromIPFS, isValidPhoto } from '@/backend/getPhoto';

import { toastError } from '@/plugins/toast';

const imageSrc = ref<string | null | ArrayBuffer>(null);

const props = defineProps({
	cid: { type: String as PropType<string | null>, default: null },
	imgClass: { type: String, default: '' },
	defaultImage: { type: String as PropType<string | null | ArrayBuffer>, default: null },
});

onMounted(async () => {
	imageSrc.value = props.defaultImage;
	if (props.cid) {
		getPhotoFromIPFS(props.cid).then((dataUrl) => {
			if (!isValidPhoto(dataUrl)) {
				toastError(`Invalid image with cid: ${props.cid}`);
				return;
			}
			imageSrc.value = dataUrl;
		});
	}
});
</script>
