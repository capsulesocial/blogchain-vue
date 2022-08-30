<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMeta } from 'vue-meta';
import { useProfilesStore } from '@/store/profiles';
import { useStore } from '@/store/session';
import BackButton from '@/components/icons/ChevronLeft.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import FriendButton from '@/components/FriendButton.vue';
import SubscribeButton from '@/components/SubscribeButton.vue';
import Avatar from '@/components/Avatar.vue';
import { getUserInfoNEAR } from '@/backend/near';
import { handleError } from '@/plugins/toast';

useMeta({
	title: `authorName - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

const store = useStore();
const router = useRouter();
const route = useRoute();
const profilesStore = useProfilesStore();

if (typeof route.params.id !== 'string') {
	throw new Error('Invalid param type for id');
}
const authorID = route.params.id;
const profileExists = ref<boolean>(false);

const profile = computed(() => profilesStore.getProfile(authorID));

onMounted(async () => {
	try {
		const nearUserInfo = await getUserInfoNEAR(authorID);
		if (nearUserInfo.publicKey) {
			profileExists.value = true;
		}
	} catch (err) {
		handleError(err);
		router.push(`/not-found`);
	}
	void profilesStore.fetchProfile(authorID);
});

const fromExternalSite = ref<boolean>(false);
const selfView = ref<boolean>(authorID === store.$state.id);
const showAvatarPopup = ref<boolean>(false);
const scrollingDown = ref<boolean>(false);
const followers = ref<[]>([]);
const following = ref<[]>([]);
const paymentsEnabled = ref<boolean>(true);
const totalPostsCount = ref<number>(0);
const userIsFollowed = ref<boolean>(false);
const activeSubscription = ref<boolean>(false);
const longBio = ref<boolean>(profile.value.bio.length > 200);
const expandBio = ref<boolean>(false);

// Check if coming from external site
router.beforeEach((to, from, next) => {
	next((vm: any) => {
		if (to && from.name === null) {
			fromExternalSite.value = true;
		}
	});
});
function handleBack() {
	if (fromExternalSite.value) {
		router.push(`/home`);
		return;
	}
	router.go(-1);
}
function toggleSettings() {
	return;
}
function toggleFriend() {
	return;
}
function toggleSubscription() {
	return;
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
</script>

<template>
	<section class="w-full">
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
							:toggle-subscription="toggleSubscription"
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
							<div v-if="totalPostsCount === 1" class="text-sm text-gray5 dark:text-gray3">
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{ totalPostsCount }}</span>
								Post
							</div>
							<div v-else class="text-sm text-gray5 dark:text-gray3">
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{ totalPostsCount }}</span>
								Posts
							</div>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ followers.length }}</span
								>
								Followers
							</button>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ following.length }}</span
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
						<button class="bg-darkBG focus:outline-none block rounded-lg xl:hidden" @click="toggleSettings">
							<PencilIcon class="m-2 h-5 w-5 text-white" />
						</button>
						<SecondaryButton
							:text="`Edit Profile`"
							:action="toggleSettings"
							class="hidden xl:block"
							:class="!scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="scrollingDown"
						/>
					</span>
					<FriendButton
						v-else
						:toggle-friend="toggleFriend"
						:user-is-followed="userIsFollowed"
						class="header-profile flex-shrink-0"
					/>
					<!-- Subscription button -->
					<SubscribeButton
						v-if="!selfView && paymentsEnabled"
						:toggle-subscription="toggleSubscription"
						:user-is-subscribed="activeSubscription"
						class="header-profile flex-shrink-0 ml-2"
					/>
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
				<p>{{ profile.bio.slice(0, 200) + (profile.bio.length > 200 ? '...' : '') }}<br /></p>
			</div>
			<button
				v-show="longBio"
				id="readMore"
				class="header-profile focus:outline-none text-xs text-primary px-1"
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
	</section>
</template>
