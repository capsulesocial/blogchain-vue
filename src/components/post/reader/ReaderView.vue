<script setup lang="ts">
import { marked } from 'marked';
import { markedRenderer, transformPostToHTML } from '@/helpers/readerExtensions';
// import ImagePopup from '@/components/popups/Image.vue';
import { decryptData } from '@/backend/crypto';
import { IPostImageKey } from '@/backend/post';
import { isValidPhoto, getPhotoFromIPFS } from '@/backend/getPhoto';
import { afterSanitizeAttrsHook, BASE_ALLOWED_ATTRS, BASE_ALLOWED_TAGS, sanitizeHtml } from '@/helpers/helpers';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { toastError } from '@/plugins/toast';

const ALLOWED_TAGS = [...BASE_ALLOWED_TAGS, `ipfsimage`];
const ALLOWED_ATTR = [...BASE_ALLOWED_ATTRS, `cid`, `alt`];

const props = withDefaults(
	defineProps<{
		content: string;
		postImages: string[];
		encrypted: boolean;
		postImageKeys: IPostImageKey[];
	}>(),
	{
		postImages: () => [],
		encrypted: false,
		postImageKeys: () => [],
	},
);

const clickedImage = ref<string | null>();
const imageError = ref<string | null>();
const displayImagePopup = ref<boolean>(false);
const el = ref<HTMLElement>();

const htmlContent = computed(() => {
	const html = marked.parse(props.content);
	const sanitizedHtml = sanitizeHtml(html, ALLOWED_TAGS, ALLOWED_ATTR);
	return transformPostToHTML(sanitizedHtml, props.postImages);
});

const openImagePopup = (image: HTMLImageElement) => {
	clickedImage.value = image.src;
	displayImagePopup.value = true;
};

const lazyLoad = (image: HTMLImageElement) => {
	const cid = image.getAttribute(`cid`);
	if (!cid) {
		toastError(`Invalid image`);
		return;
	}
	getPhotoFromIPFS(cid)
		.then(async (dataUrl) => {
			if (dataUrl.startsWith(`data:encryptedImage:`) && props.encrypted) {
				const keyData = props.postImageKeys.find((k) => k.imageCID === cid);
				if (!keyData) {
					toastError(`Key not found to decrypt image`);
					return;
				}
				dataUrl = await decryptData(dataUrl.substring(`data.encryptedImage:`.length), keyData.key, keyData.counter);
				// To prevent linking to a malicious third party image
				if (!isValidPhoto(dataUrl)) {
					toastError(`invalid in-post image`);
					return;
				}

				image.src = dataUrl;
				image.onclick = () => {
					openImagePopup(image);
				};
			}
		})
		.catch((error) => {
			imageError.value = error;
			toastError(`error malformed image ${error.message}`);
		});
};

onBeforeMount(() => {
	marked.use({ renderer: markedRenderer });
	afterSanitizeAttrsHook();
});

onMounted(() => {
	if (!el.value) {
		return;
	}
	const images = el.value.querySelectorAll(`img`);
	images.forEach((image) => {
		lazyLoad(image);
	});
});
</script>
<template>
	<div ref="el">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-html="htmlContent"></div>
		<Teleport to="body">
			<!-- <ImagePopup v-if="displayImagePopup" :image="clickedImage" @close="displayImagePopup = false" /> -->
		</Teleport>
	</div>
</template>

<style>
.ipfs_img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}
</style>
