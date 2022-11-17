<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useMeta } from 'vue-meta';
import { useProfilesStore } from '@/store/profiles';
import { useSubscriptionStore, ISubscriptionWithProfile } from '@/store/subscriptions';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { useConnectionsStore } from '@/store/connections';
import { usePaymentsStore } from '@/store/paymentProfile';
import { useRootStore } from '@/store/index';
import { getUserInfoNEAR } from '@/backend/near';
import { handleError } from '@/plugins/toast';
import { getShareableProfileLink } from '@/backend/shareable_links';

import BackButton from '@/components/icons/ChevronLeft.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import FriendButton from '@/components/FriendButton.vue';
import SubscribeButton from '@/components/subscriptions/SubscribeButton.vue';
import Avatar from '@/components/Avatar.vue';
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue';
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue';
import SubInfosPopup from '@/components/popups/SubInfosPopup.vue';
import EditProfile from '@/components/popups/EditProfile.vue';
import FollowersPopup from '@/components/popups/FollowersPopup.vue';
import FollowingPopup from '@/components/popups/FollowingPopup.vue';
import BioPopup from '@/components/popups/BioPopup.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import Image from '@/components/popups/Image.vue';
import DonationsPopup from '@/components/popups/DonationsPopup.vue';

const store = useStore();
const settings = useStoreSettings();
const useSubscription = useSubscriptionStore();
const paymentStore = usePaymentsStore();
const router = useRouter();
const route = useRoute();
const profilesStore = useProfilesStore();
const connectionsStore = useConnectionsStore();
const rootStore = useRootStore();

const authorID = computed(() => {
	if (typeof route.params.id !== `string`) {
		throw new Error(`route.params.id should be of type string!`);
	}
	return route.params.id;
});
const profile = computed(() => profilesStore.getProfile(authorID.value));
connectionsStore.fetchConnections(authorID.value);
const connections = computed(() => connectionsStore.getConnections(authorID.value));
const paymentsProfile = computed(() => paymentStore.paymentProfile(authorID.value));

const totalPostsCount = ref(0);
const profileExists = ref(false);
const isActiveSub = ref(false);
const activeSub = ref<ISubscriptionWithProfile>();
const fromExternalSite = ref(false);
const selfView = computed(() => authorID.value === store.$state.id);
const longBio = computed(() => profile.value.bio.trim().length > 230);
const showAvatarPopup = ref(false);
const scrollingDown = ref(false);
const lastScroll = ref(0);
const expandBio = ref(false);
const openFollowersPopup = ref(false);
const openFollowingPopup = ref(false);
const showEditProfile = ref(false);
const showSubscription = ref(false);
const showChangeTier = ref(false);
const friendlyUrl = ref(``);
const isLeaving = ref(false);
const realUrl = ref(``);
const showDonations = ref(false);

useMeta({
	title: profile.value.name ? `${profile.value.name} -  Blogchain` : `@${authorID.value} -  Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

// Check if coming from external site
router.beforeEach((to, from, next) => {
	next(() => {
		if (to && from.name === null) {
			fromExternalSite.value = true;
		}
	});
});

// replace URL when leaving the page
if (process.env.NODE_ENV === 'production') {
	onBeforeRouteLeave((to, from, next) => {
		if (realUrl.value !== `` && to.path !== from.path) {
			history.replaceState(history.state, ``, realUrl.value);
		}
		next();
	});
}

// methods
function handleBack() {
	if (fromExternalSite.value) {
		router.push(`/home`);
		return;
	}
	router.go(-1);
}

function toggleEdit() {
	showEditProfile.value = !showEditProfile.value;
}

function toggleDonation() {
	if (store.$state.id === ``) {
		rootStore.toggleUnauthPopup(true);
		return;
	}
	if (authorID.value === store.$state.id) {
		handleError(`You cannot donate to yourself`);
		return;
	}
	showDonations.value = !showDonations.value;
}

function updateProfileMethod() {
	store.updateFromProfile();
}

function getStyles(tab: string) {
	let res = ``;
	if (route.name === tab) {
		res += ` text-primary font-bold`;
		return res;
	}

	if (router.currentRoute.value.name !== `id-followers` && router.currentRoute.value.name !== `id-following`) {
		res += ` text-grey1`;
	}
	res += ` text-gray5 dark:text-gray3`;

	return res;
}

function handleScroll() {
	const body = document.getElementById(`scrollable_content`);
	if (!body) {
		return;
	}
	const currentScroll = body.scrollTop;
	// remove duplicates
	if (currentScroll === lastScroll.value) {
		return;
	}
	// scrolling down
	scrollingDown.value = currentScroll > lastScroll.value;
	// set new value at end
	lastScroll.value = currentScroll;
}

function handleSubscription() {
	if (!store.$state.id) {
		rootStore.toggleUnauthPopup(true);
		return;
	}
	showSubscription.value = !showSubscription.value;
}

async function getShareableLink() {
	try {
		const link = await getShareableProfileLink(authorID.value);
		friendlyUrl.value = link;
		if (!isLeaving.value) {
			realUrl.value = route.fullPath;
			history.replaceState(null, ``, friendlyUrl.value);
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(`Cannot replace state to shareable profile link: ${error}`);
	}
}

onBeforeUnmount(() => {
	isLeaving.value = true;
});

onBeforeMount(async () => {
	useSubscription.fetchSubs(store.$state.id);
	paymentStore.fetchPaymentProfile(authorID.value);
	if (process.env.NODE_ENV === 'production') {
		await getShareableLink();
	}
});

onMounted(async () => {
	try {
		const nearUserInfo = await getUserInfoNEAR(authorID.value);
		if (nearUserInfo.publicKey) {
			profileExists.value = true;
		}
	} catch (err) {
		handleError(err);
		router.push(`/not-found`);
		return;
	}
	profilesStore.fetchProfile(authorID.value);
	useConnectionsStore().fetchConnections(store.id);
	totalPostsCount.value = await profilesStore.fetchProfilePostCount(authorID.value);

	const activeSubs = useSubscription.$state.active;
	activeSubs.forEach((sub) => {
		if (sub.authorID === authorID.value) {
			isActiveSub.value = true;
			activeSub.value = sub;
		}
	});
	if (settings.recentlyInSettings) {
		showEditProfile.value = true;
		settings.setRecentlyInSettings(false);
	}
	window.addEventListener('wheel', handleScroll);
	window.addEventListener('touchmove', handleScroll);
});
</script>

<template>
	<section>
		<!-- collapsed -->
		<article
			ref="topContainer"
			class="min-h-fit header-profile z-20 w-full px-4 pt-3 xl:px-6 border-b border-lightBorder"
			:class="scrollingDown ? `opacity-1 xl:pt-4` : `opacity-0 h-0 min-h-0 xl:pt-0`"
		>
			<div class="flex flex-row items-center pb-4">
				<button
					v-if="authorID !== store.$state.id"
					class="focus:outline-none flex flex-row items-center"
					@click="handleBack"
				>
					<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><BackButton :reduce-size="true" /></span>
					<h6 class="ml-2 font-sans font-semibold dark:text-darkPrimaryText hidden lg:block">Back</h6>
				</button>
				<div
					class="header-profile flex w-full flex-row items-center justify-between z-40"
					:class="selfView ? `` : `ml-6`"
				>
					<div class="flex flex-row items-center">
						<button
							class="focus:outline-none"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
							@click="showAvatarPopup = true"
						>
							<Avatar
								:authorid="profile.id"
								:cid="profile.avatar"
								:size="`w-8 h-8`"
								:no-click="true"
								class="rounded-base flex-shrink-0"
								:class="!profile.avatar ? `cursor-default` : ``"
							/>
						</button>
						<button
							class="focus:outline-none"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
							@click="scrollingDown = false"
						>
							<h6 v-if="profile.name != ``" class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">
								{{ profile.name }}
							</h6>
							<h6 v-else class="text-gray5 dark:text-gray3 ml-2 font-sans font-semibold">{{ profile.id }}</h6>
						</button>
					</div>
					<div class="flex items-center">
						<span v-if="selfView" class="w-full h-full">
							<button class="bg-darkBG focus:outline-none rounded-lg xl:hidden" @click="toggleEdit">
								<PencilIcon class="text-white" />
							</button>
							<SecondaryButton
								:text="`Edit Profile`"
								:action="toggleEdit"
								class="hidden xl:block"
								:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
								:disabled="!scrollingDown"
							/>
						</span>
						<FriendButton
							v-else
							:authorid="authorID"
							class="header-profile"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
						<SubscribeButton
							v-if="!selfView && paymentsProfile.paymentsEnabled"
							:is-subscribed="isActiveSub"
							:action="handleSubscription"
							class="header-profile ml-2"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
					</div>
				</div>
			</div>
		</article>
		<!-- top -->
		<article
			id="header"
			ref="topContainer"
			class="header-profile z-20 w-full px-4 xl:px-6 border-b border-lightBorder"
			:class="scrollingDown ? `opacity-0 xl:pt-0 min-h-0 h-0` : `xl:pt-4 opacity-1 min-h-fit h-fit`"
		>
			<button
				v-if="authorID !== store.$state.id"
				class="focus:outline-none flex flex-row items-center mb-4"
				style="height: 34.8px"
				@click="handleBack"
			>
				<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><BackButton :reduce-size="true" /></span>
				<h6 class="ml-2 font-sans font-semibold dark:text-darkPrimaryText hidden lg:block">Back</h6>
			</button>

			<!-- Name, socials, follow, bio -->
			<div class="flex flex-row justify-between">
				<div id="infos" class="header-profile flex items-center">
					<button class="focus:outline-none mr-5" @click="showAvatarPopup = true">
						<Avatar
							:authorid="profile.id"
							:cid="profile.avatar"
							:size="`w-20 h-20`"
							:no-click="true"
							class="flex-shrink-0 rounded-lg"
							:class="!profile.avatar ? `cursor-default` : ``"
						/>
					</button>
					<div class="flex flex-grow flex-col">
						<!-- Name Username, Follow button -->
						<div class="flex flex-col">
							<h3 v-if="profile.name != ``" class="pr-4 text-2xl font-semibold dark:text-darkPrimaryText">
								{{ profile.name }}
							</h3>
							<h3 v-else class="text-gray5 dark:text-gray3 pr-4 text-2xl font-semibold">{{ profile.id }}</h3>
							<h5 class="text-gray5 dark:text-gray3 text-lg">@{{ profile.id }}</h5>
						</div>
						<!-- Tabs: posts, following, followers -->
						<div class="text-gray5 -mr-12 flex flex-row pt-2 text-sm">
							<div v-if="totalPostsCount && totalPostsCount === 1" class="text-sm text-gray5 dark:text-gray3">
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{ totalPostsCount }}</span>
								Post
							</div>
							<div v-else class="text-sm text-gray5 dark:text-gray3">
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{ totalPostsCount }}</span>
								Posts
							</div>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary transition duration-500 ease-in-out"
								@click="openFollowersPopup = true"
							>
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{
									connections?.followers.size
								}}</span>
								Followers
							</button>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary transition duration-500 ease-in-out"
								@click="openFollowingPopup = true"
							>
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{
									connections?.following.size
								}}</span>
								Following
							</button>
						</div>
					</div>
				</div>
				<!-- Profile buttons -->
				<div id="buttons" class="header-profile h-fit flex items-center xl:h-auto">
					<!-- Edit profile button -->
					<span v-if="selfView">
						<button class="bg-darkBG focus:outline-none block rounded-lg xl:hidden" @click="toggleEdit">
							<PencilIcon class="m-2 h-5 w-5 text-white" />
						</button>
						<SecondaryButton
							:text="`Edit Profile`"
							:action="toggleEdit"
							class="hidden xl:block"
							:class="!scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="scrollingDown"
						/>
					</span>
					<FriendButton v-else :authorid="authorID" class="header-profile flex-shrink-0" />
					<!-- Subscription button -->
					<div v-if="!selfView && paymentsProfile.paymentsEnabled" class="header-profile flex-shrink-0 ml-2">
						<SubscribeButton :is-subscribed="isActiveSub" :action="handleSubscription" />
					</div>
					<!-- Donate button -->
					<div
						v-if="store.$state.id !== $route.params.id && paymentsProfile.paymentsEnabled"
						class="cursor-pointer ml-2"
						@click="toggleDonation"
					>
						<!-- Desktop -->
						<div
							class="bg-neutral hover:bg-opacity-75 hidden rounded-lg px-5 text-sm font-semibold text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:flex flex-row items-center"
							style="padding-top: 0.4rem; padding-bottom: 0.4rem"
						>
							<p class="place-self-center">Donate</p>
						</div>
						<!-- Mobile -->
						<div
							class="bg-neutral rounded-lg p-1 text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
						>
							<p class="place-self-center">Donate</p>
						</div>
					</div>
				</div>
			</div>
			<!-- Bio -->
			<div
				v-show="profile.bio"
				id="bio"
				ref="bio"
				class="header-profile px-1 pt-4 dark:text-darkPrimaryText"
				:style="expandBio ? `` : `max-height: 5.5rem; overflow: hidden`"
			>
				<p>{{ profile.bio.trim().slice(0, 230) + (profile.bio.trim().length > 230 ? '...' : '') }}<br /></p>
			</div>
			<button
				v-show="longBio"
				id="readMore"
				class="header-profile focus:outline-none text-xs text-primary py-1 px-1"
				@click="expandBio = true"
			>
				Read more
			</button>
			<div v-show="!profile.bio" id="bio" class="header-profile"></div>
			<div id="divider" class="w-full bg-lightBorder dark:bg-darkBorder my-4 rounded" style="height: 1px"></div>
			<!-- Tabs -->
			<div id="tabs" class="text-gray5 dark:text-gray3 text-sm header-profile flex w-full justify-between pb-3 xl:px-6">
				<router-link :to="'/id/' + authorID" class="pb-1" :class="getStyles('Posts')">
					<span class="px-4">Posts</span>
				</router-link>
				<router-link :to="'/id/' + authorID + '/comments'" class="pb-1" :class="getStyles('Comments')">
					<span class="px-4">Comments</span>
				</router-link>
				<router-link :to="'/id/' + authorID + '/reposts'" class="pb-1" :class="getStyles('Reposts')">
					<span class="px-4">Reposts</span>
				</router-link>
			</div>
		</article>
		<router-view></router-view>
	</section>
	<Teleport to="body">
		<!-- editProfile popup -->
		<div
			v-if="showEditProfile"
			class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="toggleEdit"
		>
			<EditProfile
				class="overflow-y-auto min-h-40 max-h-90 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg"
				@update-profile-method="updateProfileMethod"
				@close="toggleEdit"
			/>
		</div>
		<SubscriptionsPopup
			v-if="showSubscription && paymentsProfile.paymentsEnabled && !isActiveSub"
			:is-subscribed="false"
			:author="profile"
			:author-avatar="profile.avatar"
			:enabled-tiers="[]"
			@close="showSubscription = false"
		/>
		<div v-if="showSubscription && activeSub">
			<SubInfosPopup :sub="activeSub" @switch-popup="showChangeTier = true" @close="showSubscription = false" />
		</div>
		<div v-if="showChangeTier && activeSub">
			<ChangeTierPopup
				:author="profile"
				:sub="activeSub"
				:author-avatar="profile.avatar"
				:enabled-tiers="[]"
				@close="showChangeTier = false"
			/>
		</div>
		<FollowersPopup v-if="openFollowersPopup" @close="openFollowersPopup = false" />
		<FollowingPopup v-if="openFollowingPopup" @close="openFollowingPopup = false" />
		<BioPopup v-if="expandBio" :id="authorID" @close="expandBio = false" />
		<Image v-if="showAvatarPopup && profile.avatar" :image="profile.avatar" @close="showAvatarPopup = false" />
		<DonationsPopup
			v-if="showDonations"
			:author="profile"
			:author-avatar="profile.avatar"
			:is-subscribed="false"
			@close="showDonations = false"
		/>
	</Teleport>
</template>

<style>
.header-profile {
	transition: all 0.4s;
	/* z-index: 50; */
}
.headernotcollapsed {
	opacity: 1;
}
</style>
