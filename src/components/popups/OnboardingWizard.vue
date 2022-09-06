<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile';
import { useRoute } from 'vue-router';
import { useStore } from '@/store/session';
import { useRootStore } from '@/store/index';
import { getPhotoFromIPFS } from '@/backend/getPhoto';
import CloseIcon from '@/components/icons/XIcon.vue';
import BrandedButton from '@/components/BrandedButton.vue';
import EditProfile from '@/components/popups/EditProfile.vue';

const store = useStore();
const route = useRoute();
const rootStore = useRootStore();
const step = ref<number>(0);
const myProfile = ref<Profile>(createDefaultProfile(store.$state.id));
const myAvatar = ref<string | ArrayBuffer | null>(null);
const visitProfile = ref<Profile>(createDefaultProfile(route.params.id as string));
const visitAvatar = ref<string | ArrayBuffer | null>(null);
const settings = ref<any>();

const emit = defineEmits(['closePopup']);

window.addEventListener(`click`, handleClose, false);

onMounted(() => {
	settings.value?.focus();
});
// methods
function getTitle(): string {
	switch (step.value) {
		case 0:
			return `Customize your homepage`;
		case 1:
			return `Discover great content`;
		case 2:
			return `Save and share bookmarks`;
		case 3:
			return `Create content easily `;
		case 4:
			return `Join the conversation `;
		case 5:
			return `Start by editing your profile`;
		default:
			return `out of scope`;
	}
}
function getText(): string {
	switch (step.value) {
		case 0:
			return `Make it truly your own by selecting your preferences for displaying content, editing tools, updating widgets, and customizing everything as you wish!`;
		case 1:
			return `Here you can easily browse posts that suit your interests. Scroll through  various categories, trending tags, or trending topics to get started.`;
		case 2:
			return `Sometimes a post or headline catches your attention, but you’re short of time. No worries. Blogchain makes it easy to save and share content for later.`;
		case 3:
			return `Have an idea you’d like to share with the world? Blogchain’s simple editing tool makes it easy to craft and publish your post through an intuitive writing experience.`;
		case 4:
			return `Agree or disagree with something you’ve read on Blogchain? Use our comment features to discuss with other readers. You can even include a custom reaction to make your point.`;
		case 5:
			return `You’ll be able to update your profile or add more information later!`;
		default:
			return `out of scope`;
	}
}
function handleClose(e: any): void {
	if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
		return;
	}
	if (e.target.firstChild.classList[0] === `popup`) {
		closeWizard();
	}
}
async function getMyProfile(update = false) {
	const { profile } = await getProfile(store.$state.id, update);
	myProfile.value = profile || createDefaultProfile(store.$state.id);
	if (myProfile.value.avatar.length > 1) {
		getPhotoFromIPFS(myProfile.value.avatar).then((p) => {
			myAvatar.value = p;
		});
	}
	// Set visitProfile to myProfile if viewing my own profile
	if (store.$state.id !== `` && store.$state.id === route.params.id) {
		visitProfile.value = myProfile.value;
		visitAvatar.value = myAvatar.value;
	}
}
function updateFromWizard(): void {
	if (route.name !== `help`) {
		if (!settings.value) {
			throw new Error(`This shouldn't happen`);
		}
		settings.value.updateFromProfile();
	}
}
function closeWizard(): void {
	rootStore.setWelcome(false);
	emit(`closePopup`);
}
</script>

<template>
	<section
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popup w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-4xl font-semibold">Welcome!</h1>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="closeWizard">
					<CloseIcon />
				</button>
			</div>
			<!-- Slide 1 -->
			<article class="flex flex-col items-center text-center">
				<video v-show="step === 0" class="mb-10 w-4/6 rounded-lg shadow-lg" autoplay muted playsinline>
					<source src="@/assets/images/onboarding/slide1.webm" type="video/webm" />
				</video>
				<video v-show="step === 1" class="mb-10 w-4/6 rounded-lg shadow-lg" autoplay muted playsinline>
					<source src="@/assets/images/onboarding/slide2.webm" type="video/webm" />
				</video>
				<video v-show="step === 2" class="mb-10 w-4/6 rounded-lg shadow-lg" autoplay muted playsinline>
					<source src="@/assets/images/onboarding/slide3.webm" type="video/webm" />
				</video>
				<video v-show="step === 3" class="mb-10 w-4/6 rounded-lg shadow-lg" autoplay muted playsinline>
					<source src="@/assets/images/onboarding/slide4.webm" type="video/webm" />
				</video>
				<video v-show="step === 4" class="mb-10 w-4/6 rounded-lg shadow-lg" autoplay muted playsinline>
					<source src="@/assets/images/onboarding/slide5.webm" type="video/webm" />
				</video>
				<h6 class="mb-5 text-xl font-bold dark:text-darkPrimaryText">{{ getTitle() }}</h6>
				<EditProfile
					v-if="$route.name != `help` && step === 5"
					ref="settings"
					:update-profile-method="getMyProfile"
					class="mb-4"
				/>
				<p class="text-gray5 dark:text-gray3 mb-10 px-10">
					{{ getText() }}
				</p>
				<!-- progress circles -->
				<div class="mb-10 self-center">
					<button class="bg-primary focus:outline-none mx-1 rounded-full p-1" @click="step = 0"></button>
					<button
						:class="step > 0 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="step = 1"
					></button>
					<button
						:class="step > 1 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="step = 2"
					></button>
					<button
						:class="step > 2 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="step = 3"
					></button>
					<button
						:class="step > 3 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="step = 4"
					></button>
					<button
						v-if="$route.name != `help`"
						:class="step > 4 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="step = 5"
					></button>
				</div>
				<!-- Next button -->
				<div v-if="(route.name === `help` && step === 4) || step === 5" class="mb-2">
					<BrandedButton
						:action="
							() => {
								updateFromWizard();
								closeWizard();
							}
						"
						:text="`Let's start! 🚀`"
					/>
				</div>
				<div v-else class="mb-2">
					<BrandedButton
						:action="
							() => {
								step = step + 1;
							}
						"
						:text="`Next`"
					/>
				</div>
			</article>
		</div>
	</section>
</template>
