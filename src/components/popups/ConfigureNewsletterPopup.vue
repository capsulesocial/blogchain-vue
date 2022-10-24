<script setup lang="ts">
import CloseIcon from '@/components/icons/XIcon.vue';
import Avatar from '@/components/Avatar.vue';
import NewsletterPreview from '@/components/NewsletterPreview.vue';

import { ref, onMounted } from 'vue';
import { useStore } from '@/store/session';
import { emailNotificationsStore } from '@/store/emailnotifications';

import { Profile } from '@/backend/profile';

const props = withDefaults(
	defineProps<{
		profile: Profile;
		avatar?: ArrayBuffer | string | null;
	}>(),
	{
		avatar: null,
	},
);

const store = useStore();
const emailNotification = emailNotificationsStore();
const newsletters = ref();
const deleted = ref(false);

const emit = defineEmits([`toggleNewsletterPopup`]);

// methods
function handleClose(e: any) {
	if (!e.target || e.target.parentNode === null || e.target.firstChild?.classList === undefined) {
		return;
	}
	if (e.target.firstChild.classList[0] === `popup`) {
		closePopup();
	}
}

async function fetchNewsletter() {
	newsletters.value = await emailNotification.getEmailSubsciption(props.profile.id);
}

async function updateNewsletter() {
	await emailNotification.fetchNewsletters(props.profile.id, store.$state.id);
	fetchNewsletter();
	deleted.value = true;
}

function closePopup() {
	emit(`toggleNewsletterPopup`, props.profile, deleted.value);
}

onMounted(async () => {
	window.addEventListener(`click`, handleClose, false);
	await emailNotification.fetchNewsletters(props.profile.id, store.$state.id);
	fetchNewsletter();
});
</script>

<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-20 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popup w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-4">
				<h4 class="text-xl font-semibold dark:text-darkPrimaryText">Configure email notification</h4>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="closePopup">
					<CloseIcon />
				</button>
			</div>
			<div>
				<!-- Avatar and description -->
				<div class="flex mb-6 items-center">
					<Avatar :author-i-d="props.profile.id" :avatar="props.avatar" :no-click="true" :size="`w-12 h-12`" />
					<p class="text-lightPrimaryText dark:text-darkPrimaryText ml-4 w-10/12">
						Manage all your email notifications from
						<span class="font-semibold"
							>{{ props.profile.name !== `` ? props.profile.name : `@${props.profile.id}` }}
						</span>
						here:
					</p>
				</div>
				<!-- List of newsletters for this author -->
				<NewsletterPreview
					v-for="newsletter in newsletters"
					:key="newsletter.email"
					:newsletter="newsletter"
					@refetch-subs="updateNewsletter"
				/>

				<!-- Submit or manage email newsletter -->
				<div class="flex justify-end items-center mt-10">
					<button
						class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
						style="padding: 0.4rem 1.5rem"
						@click="closePopup"
					>
						<span class="font-sans" style="font-size: 0.95rem"> Save </span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
