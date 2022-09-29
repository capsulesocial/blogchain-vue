<script setup lang="ts">
import { ref } from 'vue';

import UploadIcon from '@/components/icons/UploadIcon.vue';

const featuredPhoto = ref<any>(null);
const waitingImage = ref<boolean>(false);
const caption = ref<string>(``);
</script>
<template>
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border px-6 py-4 shadow-lg">
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Featured Image</h6>
		{{ featuredPhoto }}
		<button
			class="border-gray5 relative dark:border-gray3 transition duration-500 ease-in-out hover:border-primary focus:outline-none mt-3 mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed"
			:disabled="waitingImage"
		>
			<input id="featured-photo" class="hidden" name="photo" type="file" accept="image/jpeg, image/png" />
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
			<div v-else class="h-full w-full">
				<img :src="featuredPhoto" class="h-40 w-full object-cover" />
			</div>
		</button>
		<!-- Photo Uploaded -->
		<div v-if="featuredPhoto !== null" class="w-full">
			<button class="text-primary focus:outline-none text-sm">Change Image</button>
			<button class="text-negative focus:outline-none ml-4 text-sm">Remove Image</button>
		</div>
		<div
			class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 my-1 mt-3 w-full rounded-lg p-2"
			:class="featuredPhoto ? `` : `hidden`"
		>
			<label for="caption" class="hidden" value="Enter hashtags"></label>
			<input
				v-model="caption"
				type="text"
				placeholder="Image caption"
				class="focus:outline-none bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 placeholder-gray5 dark:placeholder-gray3 w-full"
			/>
		</div>
	</article>
</template>
