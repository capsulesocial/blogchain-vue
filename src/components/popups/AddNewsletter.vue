<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import CloseIcon from '@/components/icons/XIcon.vue';
import Avatar from '@/components/Avatar.vue';
// import BasicSwitch from '@/components/BasicSwitch.vue'
import CheckCircleIcon from '@/components/icons/CheckCircle.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import PlusIcon from '@/components/icons/Plus.vue';

import { Profile } from '@/backend/profile';
import { EmailSubscriptionMode } from '@/backend/emails';

import { useStore } from '@/store/session';
import { emailNotificationsStore } from '@/store/emailnotifications';
import { useRoute } from 'vue-router';
import { toastSuccess } from '@/plugins/toast';

const props = withDefaults(
	defineProps<{
		profile: Profile;
		avatar: ArrayBuffer | string | null;
	}>(),
	{},
);

const store = useStore();
const route = useRoute();
const emailNotification = emailNotificationsStore();

// refs
const paramId = computed(() => {
	if (typeof route.params.id !== `string`) {
		throw new Error('route.params.id should not be an array!');
	}
	return route.params.id;
});
// const allPosts = ref(true);
const selectedEmail = ref(``);
const userEmails = ref();
const ShowAddEmail = ref(false);
const newEmail = ref(``);
const confirmEmailSent = ref(false);

const emit = defineEmits([`newsletterStarted`, `toggleNewsletterPopup`]);

// methods
function handleClose(e: any): void {
	if (!e.target || e.target.parentNode === null || e.target.firstChild?.classList === undefined) {
		return;
	}
	if (e.target.firstChild.classList[0] === `popup`) {
		closePopup();
	}
}

function closePopup() {
	emit(`toggleNewsletterPopup`);
}

async function fetchNewsletters() {
	await emailNotification.fetchNewsletters(paramId.value, store.$state.id);
}

// function toggleAllPosts() {
// 	allPosts.value = !allPosts.value;
// }

function toggleAddEmailPopup() {
	ShowAddEmail.value = !ShowAddEmail.value;
}

async function submitSubscription() {
	const res = await emailNotification.createEmailSubscription(
		props.profile.id,
		newEmail.value.toLowerCase(),
		[],
		EmailSubscriptionMode.AllPosts,
		store.$state.id,
	);

	if (res) {
		confirmEmailSent.value = true;
		fetchNewsletters();
	}
}
// selectTag(tag: any) {
// 	return tag
// },
// selectPeriod(period: any) {
// 	return period
// },
function saveNewsletterTags() {
	return;
}
async function submitSubscriptionFromSelected() {
	const res = await emailNotification.createEmailSubscription(
		props.profile.id,
		selectedEmail.value.toLowerCase(),
		[],
		EmailSubscriptionMode.AllPosts,
		store.$state.id,
	);
	if (res) {
		fetchNewsletters();
		closePopup();
		toastSuccess(`Started newsletter successfully 🎉`);
	}
}

onMounted(async () => {
	window.addEventListener(`click`, handleClose, false);
	userEmails.value = await emailNotification.listUserEmails(store.$state.id, props.profile.id);
});
</script>

<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popup w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-4">
				<h4 v-if="!ShowAddEmail" class="text-xl font-semibold dark:text-darkPrimaryText">Create email notification</h4>
				<h4 v-else class="text-xl font-semibold dark:text-darkPrimaryText">Add a new email address</h4>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="closePopup">
					<CloseIcon />
				</button>
			</div>
			<!-- Self-view view -->
			<div v-if="store.$state.id === paramId">
				<p class="text-gray5 dark:text-gray3 mb-4">
					Display highlighted tags on your profile for readers to enable email notifications to receive your posts in
					their inbox. You can highlight up to three different tags:
				</p>
				<div class="flex flex-row justify-between mb-3 mt-8">
					<!-- Add tag input -->
					<label
						for="tagInput"
						class="font-semibold col-span-1 mr-20 mt-2 text-lightPrimaryText dark:text-darkPrimaryText"
						>Topics</label
					>
					<div class="flex flex-col w-full">
						<input
							id="tagInput"
							type="text"
							placeholder="Add three topics to your profile..."
							class="w-full rounded-lg px-4 py-2 bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none"
						/>
						<div class="flex flex-row flex-wrap mt-2">
							<button
								v-for="tag in 3"
								:key="tag"
								class="focus:outline-none bg-gray1 dark:bg-gray7 z-10 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
							>
								<span class="text-gray5 dark:text-gray1 text-lg"><p class="text-sm">Elon Musk</p></span
								><CloseIcon class="text-gray5 dark:text-gray1 p-1 pr-0" />
							</button>
						</div>
					</div>
				</div>
				<div class="flex flex-row-reverse mt-8">
					<!-- If no tags, button must be opacity-50 and deactivated -->
					<button
						:class="true ? `` : `opacity-50 cursor-not-allowed`"
						class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
						style="padding: 0.4rem 1.5rem"
						:disabled="false"
						@click="saveNewsletterTags"
					>
						<span class="font-sans" style="font-size: 0.95rem"> Save </span>
					</button>
				</div>
			</div>
			<!-- Public view -->
			<div v-else>
				<div v-if="!ShowAddEmail" class="modal-animation">
					<!-- Avatar and description -->
					<div class="flex mb-6 items-center">
						<Avatar :avatar="avatar" :author-i-d="props.profile.id" :no-click="true" :size="`w-12 h-12`" />
						<p class="text-lightPrimaryText dark:text-darkPrimaryText ml-4 w-10/12">
							Create a new email notification from
							<span class="font-semibold">{{
								props.profile.name !== `` ? props.profile.name : `@${props.profile.id}`
							}}</span
							>'s posts and manage its destination here:
						</p>
					</div>
					<!-- Topics -->
					<!-- <div class="flex flex-row justify-between mb-3 mt-8">
					<label for="tagInput" class="font-semibold mr-20 text-lightPrimaryText dark:text-darkPrimaryText"
						>Topics</label
					>
					<div class="flex flex-col w-full">
						<div class="flex justify-between items-center">
							<p class="text-gray5 dark:text-gray3 w-4/5">Receive email newsletter for all new posts</p>
							<BasicSwitch :enabled="this.allPosts" @toggle="toggleAllPosts" />
						</div>
						<p class="mt-6 mb-3 text-gray5 dark:text-gray3">Or receive email newsletter based on topics:</p>
						<div class="flex flex-row flex-wrap text-lg">
							<div v-for="tag in 3" :key="tag._id">
								<button
									class="flex flex-row items-center justify-between px-3.5 py-1.5 my-2 mr-4 border shadow-sm rounded-lg bg-gray1 dark:bg-gray7 transition duration-500 ease-in-out"
									:class="true ? `border-primary` : `border-lightBorder dark:border-darkBorder`"
									@click="selectTag(tag)"
								>
									<span class="text-gray5 dark:text-gray1 text-sm"> Elon Musk </span>
								</button>
							</div>
						</div>
					</div>
					</div> -->
					<!-- frequency -->
					<!-- <div class="flex flex-row mb-3 mt-8">
					<label for="tagInput" class="font-semibold mr-11 mt-4 text-lightPrimaryText dark:text-darkPrimaryText"
						>Frequency</label
					>
					<div class="flex flex-row flex-wrap text-lg">
						<div v-for="period in 4" :key="period._id">
							<button
								class="flex flex-row items-center justify-between px-4 py-3 my-2 mr-4 border shadow-sm rounded-lg from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG bg-gradient-to-r transition duration-500 ease-in-out"
								:class="true ? `border-primary` : `border-lightBorder dark:border-darkBorder`"
								@click="selectPeriod(period)"
							>
								<CheckCircleIcon
									:isChecked="true"
									class="text-primary w-5 h-5 mr-2 flex items-center transition duration-500 ease-in-out"
								/>
								<span class="text-lightPrimaryText dark:text-darkPrimaryText text-sm"> Monthly </span>
							</button>
						</div>
					</div>
					</div> -->
					<!-- email Destination -->
					<div class="flex flex-row justify-between mb-3 mt-10">
						<label for="tagInput" class="font-semibold mr-9 text-lightPrimaryText dark:text-darkPrimaryText"
							>Destination</label
						>
						<div class="flex flex-col w-full">
							<div class="col-span-4 flex flex-col">
								<!-- For each active email -->
								<button
									v-for="e in userEmails"
									:key="e.email"
									class="flex flex-row items-center mb-3"
									:disabled="e.authorSubbed"
									:class="e.authorSubbed ? `opacity-50` : ``"
									@click="selectedEmail = e.email"
								>
									<CheckCircleIcon
										:is-checked="selectedEmail === e.email || e.authorSubbed"
										class="text-primary w-5 h-5 mr-2 flex items-center transition duration-500 ease-in-out"
									/>
									<p class="ml-2 text-lightPrimaryText dark:text-darkPrimaryText">
										{{ e.email }}
									</p>
								</button>
								<button class="flex items-center text-primary text-sm focus:outline-none" @click="toggleAddEmailPopup">
									<PlusIcon class="p-1 mr-1" />
									Add an email address
								</button>
							</div>
						</div>
					</div>
					<!-- Submit or manage email newsletter -->
					<div class="flex justify-end items-center mt-10">
						<router-link to="/settings/notifications" class="text-sm text-primary mr-6 flex flex-row items-center"
							>Manage all my notifications</router-link
						>
						<!-- If no email or no topics selected, button must be opacity-50 and deactivated -->
						<button
							:class="true ? `` : `opacity-50 cursor-not-allowed`"
							class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
							style="padding: 0.4rem 1.5rem"
							:disabled="false"
							@click="submitSubscriptionFromSelected"
						>
							<span class="font-sans" style="font-size: 0.95rem"> Create </span>
						</button>
					</div>
				</div>
				<div v-else>
					<button class="flex items-center mt-2 modal-animation" @click="toggleAddEmailPopup">
						<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
							<ChevronLeft :reduce-size="false" />
						</div>
						<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px">
							Create notification
						</span>
					</button>
					<div v-if="!confirmEmailSent" class="modal-animation">
						<!-- email input -->
						<div class="mt-8 flex flex-col">
							<label for="newEmail" class="mb-2 font-semibold lg:mb-0 dark:text-darkPrimaryText">
								New email address
							</label>
							<input
								id="newEmail"
								v-model="newEmail"
								type="text"
								:placeholder="`Enter new email address`"
								class="mt-2 bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-4 py-3 text-black"
							/>
						</div>
						<div class="flex flex-row-reverse mt-10">
							<button
								:class="newEmail !== `` ? `` : `opacity-50 cursor-not-allowed`"
								class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
								style="padding: 0.4rem 1.5rem"
								:disabled="newEmail === ``"
								@click="submitSubscription"
							>
								<span class="font-sans" style="font-size: 0.95rem"> Send confirmation email </span>
							</button>
						</div>
					</div>
					<div v-else class="modal-animation">
						<div class="w-full flex flex-col justify-center text-center items-center px-8">
							<CheckCircleIcon class="text-primary stroke-neutral self-center my-6" :is-checked="true" />
							<h6 class="font-semibold text-lightPrimaryText dark:text-darkPrimaryText text-xl mb-4">
								We have sent you a confirmation email
							</h6>
							<p class="text-base text-center text-gray5 dark:text-gray3 mb-8">
								We emailed a confirmation link to <span class="text-primary font-semibold">{{ newEmail }}</span> Check
								your inbox and follow the link we have sent you to confirm this new email address
							</p>
							<p class="text-sm text-center text-gray5 dark:text-gray3 w-3/5 mb-4">
								Didn't get a confirmation email? Check your spam folder or
								<button class="text-primary font-semibold" @click="submitSubscription">send again</button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
