<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue';
import BrandedButton from '../BrandedButton.vue';
import PlusIcon from '../icons/PlusIcon.vue';
import XIcon from '../icons/XIcon.vue';
import { useDraftStore } from '@/store/drafts';
import { qualityTags } from '@/plugins/quality';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { isError } from '@/plugins/helpers';
import { handleError, toastError } from '@/plugins/toast';
import { preUploadPhoto, uploadPhoto } from '@/backend/photos';
import { useStore } from '@/store/session';
import { Tag } from '@/backend/post';

const draftStore = useDraftStore();
const chirpInput = ref<HTMLInputElement>();
const tagInput = ref<HTMLInputElement>();
const featuredPhotoInput = ref<HTMLInputElement>();
const waitingImage = ref(false);
const tags = ref<string[]>([]);
const featuredPhoto = ref<string | null>(null);

function handleTag() {
	const tag = tagInput.value?.value;
	if (!tag) {
		return;
	}
	const quality: { error: string } | { success: boolean } = qualityTags(tag, tags.value);
	if (isError(quality)) {
		toastError(quality.error);
		return;
	}
	draftStore.addChirpTag(tag);
	if (!tagInput.value) {
		return;
	}
	tagInput.value.value = ``;
}

function removeTag(t: Tag) {
	draftStore.removeChirpTag(t);
}

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
		featuredPhoto.value = url as string;
		draftStore.updateChirpImage(featuredPhoto.value);
	} catch (err) {
		handleError(err);
	} finally {
		target.value = ``;
		waitingImage.value = false;
	}
}

function removeImage() {
	featuredPhoto.value = null;
	draftStore.updateChirpImage(null);
}

function sendChirp() {
	console.log(chirpInput.value?.value);
	console.log(chirpInput.value?.value.length);
}

onMounted(() => {
	if (chirpInput.value) {
		chirpInput.value.value = draftStore.getChirp.content;
	}
	featuredPhoto.value = draftStore.getChirp.featuredPhotoCID ? draftStore.getChirp.featuredPhotoCID : null;
	nextTick(() => {
		chirpInput.value?.focus();
	});
});

onBeforeUnmount(() => {
	if (!chirpInput.value) {
		return;
	}
	const c = chirpInput.value.value;
	draftStore.updateChirp(c);
});
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-40 flex h-screen w-full items-start justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="draftStore.toggleChirp"
	>
		<div
			class="popup popupCard w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation mt-12 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-4xl font-semibold">Write a Chirp</h1>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="draftStore.toggleChirp">
					<CloseIcon />
				</button>
			</div>
			<!-- Input textarea -->
			<div class="">
				<textarea
					ref="chirpInput"
					placeholder="What's your Chirp?"
					class="w-full h-32 resize-none bg-gray1 dark:bg-gray5 rounded-lg focus:outline-none px-2 py-1 border focus:border-primary"
				/>
			</div>
			<!-- Featured photo -->
			<div class="my-4">
				<div
					v-if="waitingImage"
					class="w-full h-full bg-lightInput dark:bg-gray7 rounded-lg animate-pulse flex justify-center items-center"
				>
					<p class="text-sm text-gray5 dark:text-gray3">Uploading image...</p>
				</div>
				<div v-if="featuredPhoto !== null && !waitingImage" class="h-full w-full">
					<img :src="featuredPhoto" class="h-40 w-full object-cover rounded-lg" />
				</div>
			</div>
			<!-- Post metadata -->
			<div class="text-sm text-lightSecondaryText flex justify-between mb-4 mt-4">
				<!-- Add tags -->
				<div class="flex flex-row-reverse">
					<input
						v-show="tags.length < 3"
						ref="tagInput"
						class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-lg px-2 py-1 border border-gray1 focus:border-primary"
						type="text"
						placeholder="Tag"
						@keypress.enter="handleTag"
					/>
					<button
						v-for="t in draftStore.chirp.tags"
						:key="t.name"
						class="bg-gray1 px-2 py-1 mr-2 rounded-lg flex items-center"
						@click="removeTag(t)"
					>
						{{ t.name }}
						<XIcon class="p-1" />
					</button>
				</div>
				<!-- Add image -->
				<button
					v-if="featuredPhoto === null"
					:disabled="waitingImage"
					class="text-primary flex items-center"
					@click="handleUploadImageClick"
				>
					<PlusIcon class="p-1" />Add image
				</button>
				<!-- Photo Uploaded -->
				<div v-else>
					<button class="text-primary focus:outline-none text-sm" @click="handleUploadImageClick">Change Image</button>
					<button class="text-negative focus:outline-none ml-4 text-sm" @click="removeImage">Remove Image</button>
				</div>
				<input
					id="featured-photo"
					ref="featuredPhotoInput"
					class="hidden"
					name="photo"
					type="file"
					accept="image/jpeg, image/png"
					@change="handleImage"
				/>
			</div>
			<!-- Post and convert buttons -->
			<div class="flex justify-between items-center">
				<button class="text-gray5 text-semibold">Convert to Post</button>
				<BrandedButton :text="`Send Chirp`" :action="sendChirp" />
			</div>
		</div>
	</div>
</template>
