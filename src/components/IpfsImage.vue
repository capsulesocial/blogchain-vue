<template>
	<div v-if="imageSrc !== null" class="modal-animation">
		<img v-lazy="imageSrc" :class="imgClass + ' object-cover'" />
	</div>
	<div v-else class="animate-pulse bg-gray1 dark:bg-gray7"></div>
</template>

<script setup lang="ts">
import { getPhotoFromIPFS } from '@/backend/getPhoto';
import { onMounted, PropType, ref } from 'vue';

const imageSrc = ref<string | null>(null);

const props = defineProps({
	cid: { type: String as PropType<string | undefined | null>, default: null },
	imgClass: { type: String, default: '' },
	defaultImage: { type: String as PropType<string | null>, default: null },
});

onMounted(async () => {
	imageSrc.value = props.defaultImage;
	if (props.cid) {
		getPhotoFromIPFS(props.cid).then((photo) => {
			imageSrc.value = photo;
		});
	}
});
</script>

<!-- Right side: Image -->
<!-- <div
	v-if="fetchedPost.post.featuredPhotoCID !== `` && featuredPhoto === null"
	class="w-full xl:w-56 h-48 xl:h-32 bg-gray1 dark:bg-gray7 flex-shrink-0 animate-pulse rounded-lg mt-4 xl:mt-0"
></div>
<div
	v-if="fetchedPost.post.featuredPhotoCID !== `` && featuredPhoto !== null"
	class="mt-4 w-full flex-shrink-0 xl:mt-0 xl:w-56 modal-animation"
>
<router-link class="cursor-pointer" :to="`/post/` + fetchedPost.post._id">
    <img :src="featuredPhoto" class="h-48 w-full flex-shrink-0 rounded-lg object-cover xl:h-32" />
</router-link>
</div> -->
