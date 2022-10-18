<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProfilePreviewCard from '@/components/ProfilePreviewCard.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';

import { useStore } from '@/store/session';
import { handleError } from '@/plugins/toast';

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile';
import { listAllAuthors } from '@/backend/emails';

const store = useStore();

const authorIDs = ref<string[]>([]);
const authorProfiles = ref<Profile[]>([]);
const isLoading = ref(true);

defineEmits([`manageNewsletter`]);

onMounted(async () => {
	try {
		authorIDs.value = await listAllAuthors(store.$state.id);
		for (const authorID of authorIDs.value) {
			getProfile(authorID).then((p) => {
				const { profile } = p;
				authorProfiles.value.push(profile ?? createDefaultProfile(authorID));
			});
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
					@manage-newsletter="$emit(`manageNewsletter`, profile)"
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
</template>
