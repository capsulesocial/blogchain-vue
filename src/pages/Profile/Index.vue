<script setup lang="ts">
import { useMeta } from 'vue-meta'
import type { Profile } from '@/backend/profile'
import router from '@/router/index'
import { ref } from 'vue'

useMeta({
	title: `authorName - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
})

// refs
const id = ref<string>(router.currentRoute.value.params.id as string)
const fromExternalSite = ref<boolean>(false)
const selfView = ref<boolean>(true)
const visitAvatar = ref<string | ArrayBuffer>(``)
const showAvatarPopup = ref<boolean>(false)
const scrollingDown = ref<boolean>(false)
const followers = ref<[]>([])
const following = ref<[]>([])
const paymentsEnabled = ref<boolean>(true)
const totalPostsCount = ref<number>(0)
const userIsFollowed = ref<boolean>(false)
const activeSubscription = ref<boolean>(false)
const longBio = ref<boolean>(false)
const expandBio = ref<boolean>(false)

// TODO: fetch profile and set to ref
const visitProfile = ref<Profile>({
	id: `tombrady`,
	name: `Tom Brady`,
	email: `tb12@gmail.com`,
	bio: `6-time super bowl champion`,
	location: `Tampa Bay`,
	avatar: ``,
	socials: [],
	website: `tb12.com`,
})
// THEN: fetch avatar

// Check if coming from external site
router.beforeEach((to, from, next) => {
	next((vm: any) => {
		if (to && from.name === null) {
			fromExternalSite.value = true
		}
	})
})
function handleBack() {
	if (fromExternalSite.value) {
		router.push(`/home`)
		return
	}
	router.go(-1)
}
function toggleSettings() {
	return
}
function openHeader(v: boolean) {
	return
}
function toggleFriend() {
	return
}
function toggleSubscription() {
	return
}
function getStyles(tab: string): string {
	let res = ``
	if (router.currentRoute.value.name === tab) {
		res += ` text-primary font-bold`
	} else {
		if (router.currentRoute.value.name !== `id-followers` && router.currentRoute.value.name !== `id-following`) {
			res += ` text-grey1`
		}
		res += ` text-gray5 dark:text-gray3`
	}
	return res
}
</script>

<template>
	<section class="w-full">
		<!-- top -->
		<article id="header" ref="topContainer" class="min-h-fit header-profile z-20 w-full px-4 pt-3 xl:px-6 xl:pt-4">
			<!-- Back button -->
			<div class="flex flex-row items-center pb-4">
				<!-- IF viewing someone elses profile -->
				<button v-if="!selfView" class="focus:outline-none flex flex-row items-center" @click="handleBack">
					<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><BackButton :reduce-size="true" /></span>
					<h6 class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">Back</h6>
				</button>

				<div
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
						<!-- Subscription button -->
						<SubscribeButton
							v-if="selfView && paymentsEnabled"
							:toggle-subscription="toggleSubscription"
							:user-is-subscribed="activeSubscription"
							class="header-profile ml-2"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
					</div>
				</div>
			</div>
			<!-- Name, socials, follow, bio -->
			<div class="flex flex-row justify-between">
				<div id="infos" class="header-profile flex items-center" :class="selfView ? `-mt-12` : ``">
					<button class="focus:outline-none" @click="showAvatarPopup = true">
						<Avatar
							:avatar="visitAvatar"
							:author-i-d="$route.params.id"
							:size="`w-20 h-20`"
							:no-click="true"
							class="flex-shrink-0 rounded-lg"
							:class="!visitAvatar ? `cursor-default` : ``"
						/>
					</button>
					<div class="ml-5 flex flex-grow flex-col">
						<!-- Name Username, Follow button -->
						<div class="flex flex-col">
							<h3 v-if="visitProfile.name != ``" class="pr-4 text-2xl font-semibold dark:text-darkPrimaryText">
								{{ visitProfile.name }}
							</h3>
							<h3 v-else class="text-gray5 dark:text-gray3 pr-4 text-2xl font-semibold">{{ visitProfile.id }}</h3>
							<h5 class="text-gray5 dark:text-gray3 text-lg">@{{ visitProfile.id }}</h5>
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
								@click="$emit(`openFollowers`)"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ followers.length }}</span
								>
								Followers
							</button>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
								@click="$emit(`openFollowing`)"
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
				<div id="buttons" class="header-profile h-fit flex items-center xl:h-auto" :class="selfView ? `-mt-12` : ``">
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
				v-show="visitProfile.bio"
				id="bio"
				ref="bio"
				class="header-profile px-1 pt-4 dark:text-darkPrimaryText"
				:style="expandBio ? `` : `max-height: 5.5rem; overflow: hidden`"
			>
				<p>{{ visitProfile.bio.slice(0, 200) + (visitProfile.bio.length > 200 ? '...' : '') }}<br /></p>
			</div>
			<button
				v-show="longBio"
				id="readMore"
				class="header-profile focus:outline-none text-xs text-primary px-1"
				@click="expandBio = true"
			>
				Read more
			</button>
			<div v-show="!visitProfile.bio" id="bio" class="header-profile"></div>
			<div id="divider" class="w-full bg-lightBorder dark:bg-darkBorder my-4 rounded" style="height: 1px"></div>
			<!-- Tabs -->
			<div id="tabs" class="text-gray5 dark:text-gray3 text-sm header-profile flex w-full justify-between pb-3 xl:px-6">
				<nuxt-link :to="'/id/' + $route.params.id" class="pb-1" :class="getStyles('id-id')">
					<span class="px-4">Posts</span>
				</nuxt-link>
				<nuxt-link :to="'/id/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('id-id-comments')">
					<span class="px-4">Comments</span>
				</nuxt-link>
				<nuxt-link :to="'/id/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('id-id-reposts')">
					<span class="px-4">Reposts</span>
				</nuxt-link>
			</div>
		</article>
	</section>
</template>
