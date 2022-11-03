<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMeta } from 'vue-meta';
import ProfilePreviewCard from '@/components/ProfilePreviewCard.vue';
import ConfigureNewsletterPopup from '@/components/popups/ConfigureNewsletterPopup.vue';

import { useStore } from '@/store/session';
import { emailNotificationsStore } from '@/store/emailnotifications';
import { handleError } from '@/plugins/toast';

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile';
import { getPhotoFromIPFS } from '@/backend/getPhoto';

const store = useStore();
const emailNotification = emailNotificationsStore();

useMeta({
	title: `Active Email Notifications - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

const authorProfiles = ref<Profile[]>([]);
const isLoading = ref(true);
const showNewsletterPopup = ref(false);
const authorProfile = ref();
const clickedAuthorAvatar = ref<string | ArrayBuffer>();

async function toggleNewsletterPopup(clickedAuthor: Profile) {
	if (clickedAuthor) {
		authorProfile.value = clickedAuthor;
		getPhotoFromIPFS(clickedAuthor.avatar).then((profile) => {
			clickedAuthorAvatar.value = profile;
		});
	}
	showNewsletterPopup.value = !showNewsletterPopup.value;
}

async function authorLists() {
	try {
		const authorIDs = await emailNotification.listAuthors(store.$state.id);
		if (authorIDs !== undefined) {
			for (const authorID of authorIDs) {
				getProfile(authorID).then((p) => {
					const { profile } = p;
					authorProfiles.value.push(profile ?? createDefaultProfile(authorID));
				});
			}
		}
	} catch (err) {
		handleError(err);
	}
}

function deleteNewsletter(profile: Profile, deleted: boolean) {
	if (deleted === true) {
		showNewsletterPopup.value = false;
		authorProfiles.value.splice(
			authorProfiles.value.findIndex((p) => p.id === profile.id),
			1,
		);
	}

	showNewsletterPopup.value = false;
}

onMounted(async () => {
	authorLists();
	isLoading.value = false;
});
</script>
<template>
	<main id="scrollable_content">
		<!-- Email newsletter -->
		<div class="px-6 pt-4">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-2 text-base font-semibold">Email notifications</h3>
			<p class="text-gray5 dark:text-gray3 text-sm">
				You are currently receiving email notifications from the following authors:
			</p>
		</div>
		<!-- loading spinner -->
		<div v-if="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24 px-5 sm:px-4 xl:px-5">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid`"
			></div>
		</div>
		<div v-if="!isLoading && authorProfiles.length > 0" class="flex flex-wrap mt- px-6 pt-4">
			<ProfilePreviewCard
				v-for="profile in authorProfiles"
				:key="profile.id"
				:profile="profile"
				class="pb-4 mx-1 mb-2"
				@manage-newsletter="toggleNewsletterPopup"
			/>
		</div>
		<div v-if="!isLoading && authorProfiles.length <= 0" class="flex flex-col items-center text-center px-20 mt-20">
			<p class="text-gray5 dark:text-gray3 text-sm">
				It seems you have not setup any email notifications to Blogchain's authors. You can create one directly on their
				profile
			</p>
		</div>
	</main>
	<ConfigureNewsletterPopup
		v-if="showNewsletterPopup"
		:profile="authorProfile"
		:avatar="clickedAuthorAvatar"
		@toggle-newsletter-popup="deleteNewsletter"
	/>
</template>
