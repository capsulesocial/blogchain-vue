<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import NewsletterPreview from '@/components/NewsletterPreview.vue';
import AddNewsletterPopup from '@/components/popups/AddNewsletter.vue';
import EmailConfirmation from '@/components/popups/EmailConfirmation.vue';
// import TagCard from '@/components/Tag.vue'
// import PlusIcon from '@/components/icons/Plus.vue'

import { useStore } from '@/store/session';
import { useRootStore } from '@/store/index';
import { useProfilesStore } from '@/store/profiles';
import { emailNotificationsStore } from '@/store/emailnotifications';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();
const profilesStore = useProfilesStore();
const route = useRoute();
const router = useRouter();
const emailNotification = emailNotificationsStore();
const rootStore = useRootStore();

const paramId = computed(() => {
	if (typeof route.params.id !== `string`) {
		throw new Error('route.params.id should not be an array!');
	}
	return route.params.id;
});
const profile = computed(() => profilesStore.getProfile(paramId.value));
const newsletters = computed(() => emailNotification.getEmailSubsciption(paramId.value));
const showNewsletterPopup = ref(false);
const fromExternalSite = ref(false);

// Check if coming from external site
router.beforeEach((to, from, next) => {
	next(() => {
		if (to && from.name === null) {
			fromExternalSite.value = true;
		}
	});
});

// methods
function toggleNewsletterPopup() {
	if (store.$state.id) {
		showNewsletterPopup.value = !showNewsletterPopup.value;
	}
	rootStore.toggleUnauthPopup(true);
}

async function fetchNewsletters() {
	if (!store.$state.id) {
		return;
	}
	await emailNotification.fetchNewsletters(paramId.value, store.$state.id);
}

onMounted(async () => {
	await profilesStore.fetchProfile(paramId.value);
	fetchNewsletters();
});
</script>

<template>
	<article
		v-if="store.$state.id !== paramId"
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r px-6 pt-4 pb-5 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<!-- Public view -->
		<div>
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Email notifications</h6>

			<p class="text-gray5 dark:text-gray3 text-sm mb-4">
				Create email notifications to be aware of <b>{{ profile.name ? profile.name : `@${profile.id}` }}</b
				>'s new posts directly in your inbox:
			</p>
			<NewsletterPreview v-for="newsletter in newsletters" :key="newsletter.email" :newsletter="newsletter" />
			<div class="flex flex-row justify-between flex-wrap gap-y-2">
				<!-- <div class="flex flex-row items-center text-lg">
					<TagCard :tag="`green`" class="mr-2" />
					<TagCard :tag="`eggs`" class="mr-2" />
					<TagCard :tag="`ham`" class="mr-2" />
				</div> -->
				<button
					v-if="newsletters !== undefined && newsletters.length > 0"
					class="rounded-lg px-3 py-2 bg-black text-white focus:outline-none text-sm font-semibold mt-2"
					@click="toggleNewsletterPopup"
				>
					Create another notification
				</button>
				<button
					v-else
					class="rounded-lg px-3 py-2 bg-black text-white focus:outline-none text-sm font-semibold mt-2"
					@click="toggleNewsletterPopup"
				>
					Create notification
				</button>
			</div>
		</div>
		<!-- Self-view -->
		<div>
			<!-- <h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Email newsletter</h6>
			<p class="text-gray5 dark:text-gray3 text-sm mb-4">
				Display highlighted tags on your profile for readers to enable email newsletter to receive your posts:
			</p> -->
			<!-- IF No tags -->
			<!-- <button
				v-if="false"
				class="flex items-center text-primary text-sm focus:outline-none"
				@click="toggleNewsletterPopup"
			>
				<PlusIcon class="mr-1 p-1" />Add Tags
			</button> -->
			<!-- IF enabled tags -->
			<!-- <div v-else class="flex flex-row justify-between flex-wrap gap-y-2">
				<div class="flex flex-row items-center text-lg">
					<TagCard :tag="`green`" class="mr-2" />
					<TagCard :tag="`eggs`" class="mr-2" />
					<TagCard :tag="`ham`" class="mr-2" />
				</div>
				<button class="flex items-center text-primary text-sm focus:outline-none" @click="toggleNewsletterPopup">
					Manage
				</button>
			</div> -->
		</div>
	</article>

	<Teleport to="body">
		<AddNewsletterPopup
			v-if="showNewsletterPopup"
			:profile="profile"
			:avatar="profile.avatar"
			@toggle-newsletter-popup="toggleNewsletterPopup"
			@newsletter-started="fetchNewsletters"
		/>
		<EmailConfirmation
			v-if="fromExternalSite"
			:author-name="paramId"
			:email-address="newsletters[0].email"
			@close="fromExternalSite = false"
		/>
	</Teleport>
</template>
