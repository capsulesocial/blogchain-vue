<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import UploadIcon from '@/components/icons/UploadIcon.vue';
import { handleError } from '@/plugins/toast';
import { preUploadPhoto, uploadPhoto } from '@/backend/photos';
import { useStore } from '@/store/session';
import { useDraftStore } from '@/store/drafts';
import { getPhotoFromIPFS } from '@/backend/getPhoto';

const draftStore = useDraftStore();
const featuredPhoto = ref<string | null>(null);
const featuredPhotoInput = ref<HTMLInputElement>();
const waitingImage = ref(false);
const caption = ref();
const activeIndex = computed(() => draftStore.getActiveIndex);

function handleUploadImageClick() {
	if (featuredPhotoInput.value) {
		const element = featuredPhotoInput.value;
		element.click();
	}
}
async function handleImage(e: Event) {
	const eventTarget = e.target;
	if (!eventTarget) {
		return;
	}
	const target = eventTarget as HTMLInputElement;
	if (!target.files || target.files.length < 1) {
		return;
	}
	const imageFile = target.files[0];
	if (!imageFile) {
		return;
	}
	waitingImage.value = true;
	try {
		const { cid, image, imageName, url } = await uploadPhoto(imageFile);
		await preUploadPhoto(cid, image, imageName, useStore().$state.id);
		draftStore.updateFeaturedPhotoCID(cid);
		featuredPhoto.value = url as string;
	} catch (err) {
		handleError(err);
	} finally {
		target.value = ``;
		waitingImage.value = false;
	}
}

function removeImage() {
	draftStore.updateFeaturedPhotoCID(null);
	featuredPhoto.value = null;
	draftStore.updateFeaturedPhotoCaption(null);
	caption.value.value = ``;
}

function handleCaption() {
	const c = caption.value.value;
	draftStore.updateFeaturedPhotoCaption(c === `` ? null : c);
}

async function initImage() {
	featuredPhoto.value = null;
	waitingImage.value = false;
	const draftFeaturedPhotoCID = draftStore.drafts[draftStore.activeIndex].featuredPhotoCID;
	if (!draftFeaturedPhotoCID) {
		return;
	}
	featuredPhoto.value = await getPhotoFromIPFS(draftFeaturedPhotoCID);
	caption.value.value = draftStore.drafts[draftStore.activeIndex].featuredPhotoCaption;
}

watch(activeIndex, async () => {
	await initImage();
});

onMounted(async () => {
	await initImage();
});
</script>
<template>
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border px-6 py-4 shadow-lg">
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Featured Image</h6>
		<button
			class="border-gray5 relative dark:border-gray3 transition duration-500 ease-in-out hover:border-primary focus:outline-none mt-3 mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed"
			:disabled="waitingImage"
			@click="handleUploadImageClick"
		>
			<input
				id="featured-photo"
				ref="featuredPhotoInput"
				class="hidden"
				name="photo"
				type="file"
				accept="image/jpeg, image/png"
				@change="handleImage"
			/>
			<!-- No Photo Uploaded -->
			<div
				v-if="waitingImage"
				class="absolute w-full h-full bg-lightInput dark:bg-gray7 rounded-lg animate-pulse flex justify-center items-center"
			>
				<p class="text-sm text-gray5 dark:text-gray3">Uploading image...</p>
			</div>
			<div v-if="featuredPhoto === null && !waitingImage" class="flex flex-col justify-center">
				<UploadIcon class="self-center text-gray5 dark:text-gray3" />
				<p class="text-primary mt-2 text-left text-sm font-light">Upload an Image</p>
			</div>
			<div v-if="featuredPhoto !== null && !waitingImage" class="h-full w-full">
				<img :src="featuredPhoto" class="h-40 w-full object-cover" />
			</div>
		</button>
		<!-- Photo Uploaded -->
		<div v-if="featuredPhoto !== null" class="w-full">
			<button class="text-primary focus:outline-none text-sm" @click="handleUploadImageClick">Change Image</button>
			<button class="text-negative focus:outline-none ml-4 text-sm" @click="removeImage">Remove Image</button>
		</div>
		<div
			class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 my-1 mt-3 w-full rounded-lg p-2"
			:class="featuredPhoto ? `` : `hidden`"
		>
			<label for="caption" class="hidden" value="Enter photo caption"></label>
			<input
				id="caption"
				ref="caption"
				type="text"
				placeholder="Image caption"
				class="focus:outline-none bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 placeholder-gray5 dark:placeholder-gray3 w-full"
				@input="handleCaption"
			/>
		</div>
	</article>
</template>
