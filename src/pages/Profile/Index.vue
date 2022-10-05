<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMeta } from 'vue-meta';
import { useProfilesStore } from '@/store/profiles';
import { useSubscriptionStore, ISubscriptionWithProfile } from '@/store/subscriptions';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { useConnectionsStore } from '@/store/connections';
import { PaymentProfile, usePaymentsStore } from '@/store/paymentProfile';
import { getUserInfoNEAR } from '@/backend/near';
import { handleError } from '@/plugins/toast';

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

const store = useStore();
const settings = useStoreSettings();
const useSubscription = useSubscriptionStore();
const paymentStore = usePaymentsStore();
const router = useRouter();
const route = useRoute();
const profilesStore = useProfilesStore();
const connectionsStore = useConnectionsStore();

const authorID = computed(() => {
	if (typeof route.params.id !== `string`) {
		throw new Error(`route.params.id should be of type string!`);
	}
	return route.params.id;
});
const profile = computed(() => profilesStore.getProfile(authorID.value));
connectionsStore.fetchConnections(authorID.value);
const connections = computed(() => connectionsStore.getConnections(authorID.value));
const paymentsProfile = ref<PaymentProfile>(paymentStore.paymentProfile(authorID.value));

const totalPostsCount = ref<number>(0);
const profileExists = ref<boolean>(false);
const isActiveSub = ref<boolean>(false);
const activeSub = ref<ISubscriptionWithProfile>();
const fromExternalSite = ref<boolean>(false);
const selfView = ref<boolean>(authorID.value === store.$state.id);
const showAvatarPopup = ref<boolean>(false);
const scrollingDown = ref<boolean>(false);
const lastScroll = ref<number>(0);
const longBio = computed(() => profile.value.bio.length > 200);
const expandBio = ref<boolean>(false);
const openFollowersPopup = ref<boolean>(false);
const openFollowingPopup = ref<boolean>(false);
const showSettings = ref<boolean>(false);
const showSubscription = ref<boolean>(false);
const showChangeTier = ref<boolean>(false);

useMeta({
	title: profile.value.name ? `${profile.value.name} -  Blogchain` : `@${authorID.value} -  Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

// Check if coming from external site
router.beforeEach((to, from, next): void => {
	next((vm: any) => {
		if (to && from.name === null) {
			fromExternalSite.value = true;
		}
	});
});

// methods
function handleBack(): void {
	if (fromExternalSite.value) {
		router.push(`/home`);
		return;
	}
	router.go(-1);
}
function toggleEdit(): void {
	showSettings.value = !showSettings.value;
}
function updateProfileMethod(): void {
	store.updateFromProfile();
}
function getStyles(tab: string): string {
	let res = ``;
	if (route.name === tab) {
		res += ` text-primary font-bold`;
	} else {
		if (router.currentRoute.value.name !== `id-followers` && router.currentRoute.value.name !== `id-following`) {
			res += ` text-grey1`;
		}
		res += ` text-gray5 dark:text-gray3`;
	}
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
	if (currentScroll > lastScroll.value && !scrollingDown.value) {
		scrollingDown.value = true;
	} else {
		scrollingDown.value = false;
	}
	// set new value at end
	lastScroll.value = currentScroll;
}

onBeforeMount(async () => {
	void useSubscription.fetchSubs(store.$state.id);
	const res = await paymentStore.fetchPaymentProfile(authorID.value);
	paymentsProfile.value = res;
});

onMounted(async (): Promise<void> => {
	try {
		const nearUserInfo = await getUserInfoNEAR(authorID.value);
		if (nearUserInfo.publicKey) {
			profileExists.value = true;
		}
	} catch (err) {
		handleError(err);
		router.push(`/not-found`);
	}
	void profilesStore.fetchProfile(authorID.value);
	void useConnectionsStore().fetchConnections(store.id);
	totalPostsCount.value = await profilesStore.fetchProfilePostCount(authorID.value);

	const activeSubs = await useSubscription.$state.active;
	activeSubs.forEach((sub: ISubscriptionWithProfile): void => {
		if (sub.authorID === authorID.value) {
			isActiveSub.value = true;
			activeSub.value = sub;
		}
	});
	if (settings.recentlyInSettings) {
		showSettings.value = true;
		settings.setRecentlyInSettings(false);
	}
	window.addEventListener('wheel', handleScroll);
	window.addEventListener('touchmove', handleScroll);
});
</script>

<template>
	<section id="subPopup" class="w-full">
		<!-- top -->
		<article id="header" ref="topContainer" class="min-h-fit header-profile z-20 w-full px-4 pt-3 xl:px-6 xl:pt-4">
			<!-- Back button -->
			<div v-if="!selfView" class="flex flex-row items-center pb-4">
				<!-- IF viewing someone elses profile -->
				<button class="focus:outline-none flex flex-row items-center" @click="handleBack">
					<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><BackButton :reduce-size="true" /></span>
					<h6 class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">Back</h6>
				</button>

				<!-- <div
					id="small"
					class="header-profile flex w-full flex-row items-center justify-between z-40 opacity0"
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
								:avatar="visitAvatar"
								:author-i-d="$route.params.id"
								:size="`w-8 h-8`"
								:no-click="true"
								class="rounded-base flex-shrink-0"
								:class="!visitAvatar ? `cursor-default` : ``"
							/>
						</button>
						<button
							class="focus:outline-none"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
							@click="openHeader(true)"
						>
							<h6 v-if="visitProfile.name != ``" class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">
								{{ visitProfile.name }}
							</h6>
							<h6 v-else class="text-gray5 dark:text-gray3 ml-2 font-sans font-semibold">{{ visitProfile.id }}</h6>
						</button>
					</div>
					<div class="flex items-center">
						<span v-if="selfView" class="w-full h-full">
							<button class="bg-darkBG focus:outline-none rounded-lg xl:hidden" @click="toggleSettings">
								<PencilIcon class="text-white" />
							</button>
							<SecondaryButton
								:text="`Edit Profile`"
								:action="toggleSettings"
								class="hidden xl:block"
								:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
								:disabled="!scrollingDown"
							/>
						</span>
						<FriendButton
							v-else
							:toggle-friend="toggleFriend"
							:user-is-followed="userIsFollowed"
							class="header-profile"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
						<SubscribeButton
							v-if="selfView && paymentsEnabled"
							:toggle-subscription="showSubscription"
							:user-is-subscribed="activeSubscription"
							class="header-profile ml-2"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
					</div>
				</div> -->
			</div>
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
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
								@click="openFollowersPopup = true"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ connections?.followers.size }}</span
								>
								Followers
							</button>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
								@click="openFollowingPopup = true"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ connections?.following.size }}</span
								>
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
						<SubscribeButton :is-subscribed="isActiveSub" :action="() => (showSubscription = !showSubscription)" />
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
				<p>{{ profile.bio.slice(0, 260) + (profile.bio.length > 260 ? '...' : '') }}<br /></p>
			</div>
			<button
				v-show="longBio"
				id="readMore"
				class="header-profile focus:outline-none text-xs text-primary py-1"
				@click="expandBio = true"
			>
				Read more
			</button>
			<div v-show="!profile.bio" id="bio" class="header-profile"></div>
			<div id="divider" class="w-full bg-lightBorder dark:bg-darkBorder my-4 rounded" style="height: 1px"></div>
			<!-- Tabs -->
			<div id="tabs" class="text-gray5 dark:text-gray3 text-sm header-profile flex w-full justify-between pb-3 xl:px-6">
				<router-link :to="'/id/' + $route.params.id" class="pb-1" :class="getStyles('Posts')">
					<span class="px-4">Posts</span>
				</router-link>
				<router-link :to="'/id/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('Comments')">
					<span class="px-4">Comments</span>
				</router-link>
				<router-link :to="'/id/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('Reposts')">
					<span class="px-4">Reposts</span>
				</router-link>
			</div>
		</article>
		<router-view></router-view>
		<!-- Settings popup -->
		<div
			v-if="showSettings"
			class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<EditProfile
				class="overflow-y-auto min-h-40 max-h-90 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg"
				@update-profile-method="updateProfileMethod"
				@close="toggleEdit"
			/>
		</div>
	</section>
	<Teleport to="body">
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
	</Teleport>
</template>
