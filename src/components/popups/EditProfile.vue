<script setup lang="ts">
import { ref } from 'vue';
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent';
import CloseIcon from '@/components/icons/XIcon.vue';
import Avatar from '@/components/Avatar.vue';
import { useStore } from '@/store/session';
import { useRoute } from 'vue-router';
import PencilIcon from '@/components/icons/Pencil.vue';
import BrandedButton from '../BrandedButton.vue';
import { preUploadPhoto, uploadPhoto } from '@/backend/photos';
import { getProfile } from '@/backend/profile';
import { URLRegex, qualityBio, qualityLocation, qualityEmail } from '@/plugins/quality';
import { getPhotoFromIPFS } from '@/backend/getPhoto';
import textLimits from '@/backend/utilities/text_limits';
import { isError } from '@/plugins/helpers';
import { toastError, toastWarning, toastSuccess } from '@/plugins/toast';

const store = useStore();
const route = useRoute();

// refs
const newName = ref<string>(``);
const profilePic = ref<null | string | ArrayBuffer>(null);
const bio = ref<string>(``);
const maxCharBio = ref<number>(textLimits.bio.max);
const newAvatarCID = ref<string>(``);
const uploadedPic = ref<HTMLElement>();
const newEmail = ref<string>(``);
const location = ref<string>(``);
const website = ref<string>(``);
const avatar = ref<string>(store.$state.avatar);

const emit = defineEmits(['close', 'updateProfileMethod']);

if (store.$state.avatar !== ``) {
	getPhotoFromIPFS(store.$state.avatar).then((p) => {
		profilePic.value = p;
	});
}
if (store.$state.name !== ``) {
	newName.value = store.$state.name;
}
if (store.$state.bio !== ``) {
	bio.value = store.$state.bio;
}
if (store.$state.location !== ``) {
	location.value = store.$state.location;
}
if (store.$state.website !== ``) {
	website.value = store.$state.website || '';
}
if (store.$state.email !== ``) {
	newEmail.value = store.$state.email;
}
if (store.$state.avatar !== ``) {
	newAvatarCID.value = store.$state.avatar;
}
// methods
function handleImageClick(): void {
	const b = uploadedPic.value as HTMLElement;
	b.click();
}
function hasChanged() {
	return (
		newAvatarCID.value.trim() !== store.$state.avatar ||
		newName.value.trim() !== store.$state.name ||
		newEmail.value.trim() !== store.$state.email ||
		location.value.trim() !== store.$state.location ||
		website.value.trim() !== store.$state.website ||
		bio.value.trim() !== store.$state.bio
	);
}
async function handleImage(e: HTMLInputEvent) {
	if (!e.target.files) {
		toastError(`No image selected`);
		return;
	}
	const img = e.target.files[0];
	if (img) {
		try {
			const { cid, url, image, imageName } = await uploadPhoto(img);
			await preUploadPhoto(cid, image, imageName, store.$state.id);
			profilePic.value = url;
			newAvatarCID.value = cid;
		} catch (err) {
			toastError(`Unsuccessful avatar upload!`);
		}
	}
}
function checkBio() {
	const charCount = bio.value.trim().length;
	return maxCharBio.value - charCount;
}
async function updateFromProfile() {
	if (hasChanged() === false) {
		toastWarning(`Nothing to update`);
		return;
	}
	const trimmedName = newName.value.trim();
	const trimmedBio = bio.value.trim();
	const trimmedEmail = newEmail.value.trim();
	const trimmedLocation = location.value.trim();
	const trimmedWebsite = website.value.trim();
	// Update name
	if (trimmedName.length !== 0 && (trimmedName.length <= 2 || trimmedName.length > 32)) {
		toastError(`Name length must be between 3 and 32 chars`);
		return;
	}
	store.setName(trimmedName);
	// Update bio
	const checkQualityBio = qualityBio(trimmedBio);
	if (isError(checkQualityBio)) {
		toastError(checkQualityBio.error);
		return;
	}
	store.setBio(trimmedBio);
	// Update email
	if (trimmedEmail.length > 0) {
		const qlityEmail = qualityEmail(trimmedEmail);
		if (isError(qlityEmail)) {
			toastError(qlityEmail.error);
			return;
		}
	}
	store.setEmail(trimmedEmail);
	// Update location
	const checkQualityLocation = qualityLocation(trimmedLocation);
	if (isError(checkQualityLocation)) {
		toastError(checkQualityLocation.error);
		return;
	}
	store.setLocation(trimmedLocation);
	// Update website
	if (trimmedWebsite.length > 0 && !URLRegex.test(trimmedWebsite)) {
		toastError(`Invalid URL`);
		return;
	}
	store.setWebsite(trimmedWebsite);
	// Update Avatar
	if (newAvatarCID.value !== ``) {
		store.setAvatar(newAvatarCID.value);
		getProfile(store.$state.id, true); // Update cached profile
	}
	try {
		const profileUpdated = await store.updateFromProfile();
		if (profileUpdated) {
			emit(`close`);
			// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
			toastSuccess(`Your profile has been successfully updated`);
		}
		emit(`updateProfileMethod`);
	} catch (err) {
		throw new Error(`${err}`);
	}
}

defineExpose({ updateFromProfile });
</script>

<template>
	<div class="popup w-full p-6 pt-4">
		<!-- Header and Close button -->
		<header v-if="store.$state.id === route.params.id" class="mb-6 flex flex-row justify-between items-center">
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">Edit your profile</h2>
			<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="$emit(`close`)">
				<CloseIcon />
			</button>
		</header>
		<!-- Change avatar -->
		<div class="mb-5 flex w-full justify-center">
			<button class="focus:outline-none relative h-24 w-24" @click="handleImageClick">
				<span class="absolute inline-flex w-24 h-24 top-0 left-0">
					<Avatar :author-i-d="store.$state.id" :avatar="avatar" :no-click="true" :size="`w-24 h-24`" />
				</span>
				<span
					class="bg-darkOnPrimaryText text-lightOnPrimaryText absolute inline-flex h-24 w-24 top-0 left-0 items-center justify-center rounded-lg bg-opacity-25"
				>
					<PencilIcon class="h-5 w-5 fill-current" />
				</span>
			</button>
			<input
				id="file-input"
				ref="uploadedPic"
				class="hidden"
				name="file"
				type="file"
				accept="image/jpeg, image/png"
				@change="handleImage"
			/>
		</div>
		<!-- Name -->
		<div class="mb-4 flex flex-col lg:flex-row">
			<label for="newName" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText text-left"
				>Display Name</label
			>
			<input
				id="newName"
				v-model="newName"
				type="text"
				:placeholder="`Enter display name`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Bio -->
		<div class="mb-6 flex flex-col lg:flex-row">
			<label for="bio" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText text-left">Bio</label>
			<div class="flex-grow">
				<textarea
					id="bio"
					:maxlength="maxCharBio"
					:value="bio"
					:placeholder="`Display Blogchain Bio`"
					class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none w-full rounded-lg px-2 py-1 text-black"
					@input="bio = ($event.target as HTMLInputElement).value"
					@keyup="checkBio()"
				></textarea>
				<p class="text-right text-xs text-gray5 dark:text-gray3">{{ checkBio() }} Characters Remaining</p>
			</div>
		</div>
		<!-- Location -->
		<div v-if="store.$state.id === $route.params.id" class="mb-4 flex flex-col lg:flex-row">
			<label for="location" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Location</label>
			<input
				id="location"
				v-model="location"
				type="text"
				:placeholder="`Display your location`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Website -->
		<div v-if="store.$state.id === $route.params.id" class="mb-4 flex flex-col lg:flex-row">
			<label for="website" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Website</label>
			<input
				id="website"
				v-model="website"
				type="text"
				:placeholder="`Display a website`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Email -->
		<div v-if="store.$state.id === $route.params.id" class="mb-4 flex flex-col lg:flex-row">
			<label for="newEmail" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Email</label>
			<input
				id="newEmail"
				v-model="newEmail"
				type="email"
				:placeholder="`Display a contact email`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Submit button -->
		<div v-if="store.$state.id === $route.params.id" class="flex justify-end">
			<BrandedButton
				:class="hasChanged() ? '' : 'opacity-50 cursor-not-allowed'"
				:disabled="!hasChanged()"
				:action="updateFromProfile"
				:text="`Save changes`"
			/>
		</div>
	</div>
</template>
