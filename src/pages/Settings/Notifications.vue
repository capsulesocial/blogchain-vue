<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProfilePreviewCard from '@/components/ProfilePreviewCard.vue';
import ConfigureNewsletterPopup from '@/components/popups/ConfigureNewsletterPopup.vue';
import BasicConfirmAlert from '@/components/popups/BasicConfirmAlert.vue';

import ChevronLeft from '@/components/icons/ChevronLeft.vue';

import { useStore } from '@/store/session';
import { emailNotificationssStore } from '@/store/emailnotifications';
import { handleError } from '@/plugins/toast';

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile';
import { getPhotoFromIPFS } from '@/backend/getPhoto';
import { IEmailSubscription } from '@/backend/emails';

const store = useStore();
const emailNotification = emailNotificationssStore();

const authorProfiles = ref<Profile[]>([]);
const isLoading = ref(true);
const showNewsletterPopup = ref(false);
const authorProfile = ref();
const clickedAuthorAvatar = ref<string | ArrayBuffer>();
const showDeletePopup = ref(false);
const tobeDeleted = ref<IEmailSubscription>();

async function toggleNewsletterPopup(clickedAuthor: Profile) {
	if (clickedAuthor) {
		authorProfile.value = clickedAuthor;
		getPhotoFromIPFS(clickedAuthor.avatar).then((p) => {
			clickedAuthorAvatar.value = p;
		});
	}
	showNewsletterPopup.value = !showNewsletterPopup.value;
}

async function fetchNewsletters() {
	if (!store.$state.id) {
		return;
	}
	if (tobeDeleted.value !== undefined) {
		await emailNotification.fetchNewsletters(tobeDeleted.value.authorID, store.$state.id);
	}
}

async function toggleConfirmPopup(newsletter: IEmailSubscription) {
	showDeletePopup.value = true;
	tobeDeleted.value = newsletter;
}
async function confirmDelete() {
	if (tobeDeleted.value !== undefined) {
		await emailNotification.deleteEmailSubsciption(tobeDeleted.value.authorID, store.$state.id);
	}

	fetchNewsletters();
}

onMounted(async () => {
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
	isLoading.value = false;
});
</script>
<template>
	<main>
		<!-- Mobile back button -->
		<router-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft :reduce-size="false" /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</router-link>
		<!-- Email newsletter -->
		<div class="ml-10 pt-5">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-2 text-base font-semibold">Email notifications</h3>
			<p class="text-gray5 dark:text-gray3 text-sm">
				You are currently receiving email notifications from the following authors:
			</p>
			<div v-if="!isLoading" class="flex flex-wrap mt-4">
				<ProfilePreviewCard
					v-for="profile in authorProfiles"
					:key="profile.id"
					:profile="profile"
					class="pb-4 mx-1 mb-2"
					@manage-newsletter="toggleNewsletterPopup"
				/>
			</div>
		</div>
		<div v-if="!isLoading && authorProfiles.length === 0" class="flex justify-center text-center px-20 mt-20">
			<p class="text-gray5 dark:text-gray3 text-sm">
				It seems you have not setup any email notifications to Blogchain's authors. You can create one directly on their
				profile
			</p>
		</div>
	</main>
	<Teleport to="body">
		<ConfigureNewsletterPopup
			v-if="showNewsletterPopup"
			:profile="authorProfile"
			:avatar="clickedAuthorAvatar"
			@toggle-newsletter-popup="toggleNewsletterPopup"
			@show-delete-popup="toggleConfirmPopup"
		/>
		<BasicConfirmAlert
			v-if="showDeletePopup"
			:text="`Are you sure you want to cancel this email notification? You can still add it again later`"
			@close="showDeletePopup = false"
			@confirm="confirmDelete"
		/>
	</Teleport>
</template>
