<script setup lang="ts">
import { PropType, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useMeta } from 'vue-meta'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import BackButton from '@/components/icons/ChevronLeft.vue'
import SubscribeButton from '@/components/SubscribeButton.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import BioPopup from '@/components/popups/BioPopup.vue'
import { useStore } from '@/store/session'
import { useRouter, useRoute } from 'vue-router'
// TODO: uncomment this after the related profile interface in added.
// import { Profile } from '@/backend/profile'
import { storeToRefs } from 'pinia'
const store = storeToRefs(useStore())
const router = useRouter()
const route = useRoute()
useMeta({
	title: `authorName - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
})

const props = defineProps({
	visitProfile: {
		type: Object as PropType<Profile | null>,
		default: null,
	},
	visitAvatar: {
		type: String as PropType<ArrayBuffer | string | undefined>,
		default: undefined,
	},
	followers: {
		type: Set,
		required: true,
	},
	following: {
		type: Set,
		required: true,
	},
	toggleFriend: {
		type: Function as PropType<() => void>,
		required: true,
	},
	toggleSubscription: {
		type: Function as PropType<() => void>,
		required: true,
	},
	updateFollowers: {
		type: Function as PropType<() => void>,
		required: true,
	},
	userIsFollowed: {
		type: Boolean,
		required: true,
	},
	mutuals: {
		type: Set,
		default: new Set(),
	},
	mutualProfiles: {
		type: Array,
		default: () => {
			return []
		},
	},
	toggleEdit: {
		type: Boolean,
		required: false,
	},
	updateProfileMethod: {
		type: Function as PropType<() => void>,
		required: true,
	},
})

const emit = defineEmits(['showAvatar', 'openFollowing', 'openFollowers'])

// refs
const totalPostsCount = ref<number>(0)
const padding = ref<string>(`0px`)
const showSettings = ref<boolean>(false)
const lastScroll = ref<number>(0)
const scrollingDown = ref<boolean>(false)
const longBio = ref<boolean>(false)
const expandBio = ref<boolean>(false)
const fromExternalSite = ref<boolean>(false)
const activeSubscription = ref<boolean>(false)

watch(route, (n, o) => {
	if (n.params.id !== o.params.id) {
		// TODO: Update post count
		window.addEventListener(`click`, handleClose, false)
		fetchProfile()
		initHeader()
	}
})

onMounted(() => {
	// TODO: Check for $store.state.settings.recentlyInSettings and set showSettings = true
	nextTick(() => {
		initHeader()
	})
	window.addEventListener(`click`, handleClose, false)
})

// Destroyed hook
onUnmounted(() => {
	// TODO: check for store.state.settings.recentlyInSettings and set it to false
})

// methods
function initHeader() {
	// Set scroll padding
	const topContainer = ref()
	padding.value = topContainer.value.clientHeight + `px`
	scrollingDown.value = false
	const container = document.getElementById(`scrollContainer`)
	if (container) {
		container.addEventListener(`scroll`, handleScrollHeader)
	}
	// handle long bios
	if (props.visitProfile && props.visitProfile.bio.length > 200) {
		longBio.value = true
	}
}
function showAvatar() {
	if (props.visitAvatar) {
		emit(`showAvatar`)
	}
}
function paymentsEnabled() {
	// TODO: Check if user has enabled payments
	return false
}
function handleClose(e: any): void {
	if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
		return
	}
	if (e.target.firstChild.classList[0] === `popup`) {
		showSettings.value = false
	}
}

function toggleSettings(): void {
	showSettings.value = !showSettings.value
}
function loadedContent(): boolean {
	// Check follow page
	return !(route.name === `id-followers` && props.followers.size === 0)
}
function getStyles(tab: string): string {
	const res = ref<string>(``)
	if (route.name === tab) {
		res.value += ` text-primary font-bold`
	} else {
		if (route.name !== `id-followers` && route.name !== `id-following`) {
			res.value += ` text-grey1`
		}
		res.value += ` text-gray5 dark:text-gray3`
	}
	return res.value
}

function openHeader(open: boolean) {
	const body = document.getElementById(`scrollContainer`)
	const header = document.getElementById(`header`)
	const buttons = document.getElementById(`buttons`)
	const infos = document.getElementById(`infos`)
	const tabs = document.getElementById(`tabs`)
	const divider = document.getElementById(`divider`)
	const bio = document.getElementById(`bio`)
	const readMore = document.getElementById(`readMore`)
	const small = document.getElementById(`small`)
	padding.value = header?.clientHeight + `px`
	const scrollUp = `headernotcollapsed`
	const scrollDown = `headercollapsed`
	const opacity1 = `opacity1`
	const opacity0 = `opacity0`
	if (!body || !buttons || !infos || !header || !tabs || !divider || !bio || !small || !readMore) {
		return
	}
	// Close header
	if (!open) {
		scrollingDown.value = true
		header.classList.remove(scrollUp)
		header.classList.add(scrollDown)
		buttons.classList.remove(opacity1)
		buttons.classList.add(opacity0)
		infos.classList.remove(opacity1)
		infos.classList.add(opacity0)
		tabs.classList.add(opacity0)
		tabs.classList.remove(opacity1)
		divider.classList.add(opacity0)
		divider.classList.remove(opacity1)
		bio.classList.add(opacity0)
		bio.classList.remove(opacity1)
		readMore.classList.add(opacity0)
		readMore.classList.remove(opacity1)
		small.classList.add(opacity1)
		small.classList.remove(opacity0)
		return
	}
	// open
	scrollingDown.value = false
	header.classList.remove(scrollDown)
	header.classList.add(scrollUp)
	buttons.classList.remove(opacity0)
	buttons.classList.add(opacity1)
	infos.classList.remove(opacity0)
	infos.classList.add(opacity1)
	tabs.classList.remove(opacity0)
	tabs.classList.add(opacity1)
	divider.classList.remove(opacity0)
	divider.classList.add(opacity1)
	bio.classList.remove(opacity0)
	bio.classList.add(opacity1)
	readMore.classList.remove(opacity0)
	readMore.classList.add(opacity1)
	small.classList.remove(opacity1)
	small.classList.add(opacity0)
}

function handleScrollHeader() {
	const body = document.getElementById(`scrollContainer`)
	const header = document.getElementById(`header`)
	const buttons = document.getElementById(`buttons`)
	const infos = document.getElementById(`infos`)
	const tabs = document.getElementById(`tabs`)
	const bio = document.getElementById(`bio`)
	const small = document.getElementById(`small`)
	padding.value = header?.clientHeight + `px`
	const scrollDown = `headercollapsed`
	if (!body || !buttons || !infos || !header || !tabs || !bio || !small) {
		return
	}
	const currentScroll = body.scrollTop
	// Reached bottom, prevent mobile glitching
	if (currentScroll + body.clientHeight + 1 >= body.scrollHeight) {
		if (body.scrollHeight === body.clientHeight && currentScroll === 0) {
			openHeader(true)
			const container = document.getElementById(`scrollContainer`)
			if (container) {
				container.removeEventListener(`scroll`, handleScrollHeader)
			}
			return
		}
		return
	}
	// Reached top
	if (body.scrollTop <= 0 && !scrollingDown.value) {
		openHeader(true)
		return
	}
	if (currentScroll > lastScroll.value && !header.classList.contains(scrollDown)) {
		// down
		openHeader(false)
	} else if (
		currentScroll < lastScroll.value &&
		header.classList.contains(scrollDown) &&
		body.scrollTop + body.clientHeight !== body.scrollHeight
	) {
		// up
		openHeader(true)
	}
	lastScroll.value = currentScroll
}
async function fetchProfile() {
	if (route.params.id === null) {
		return
	}
	// TODO: set totalPostsCount from the posts length from store
	totalPostsCount
}

function handleBack() {
	if (fromExternalSite.value) {
		router.push({ name: `home` })
		return
	}
	router.go(-1)
}
</script>

<template>
	<section class="w-full">
		<!-- top -->
		<article id="header" ref="topContainer" class="min-h-fit header-profile z-20 w-full px-4 pt-3 xl:px-6 xl:pt-4">
			<!-- Back button -->
			<div class="flex flex-row items-center pb-4">
				<button
					v-if="$route.params.id !== store.id.value"
					class="focus:outline-none flex flex-row items-center"
					@click="handleBack"
				>
					<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><BackButton :reduce-size="true" /></span>
					<h6 class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">Back</h6>
				</button>
				<div
					id="small"
					class="header-profile flex w-full flex-row items-center justify-between z-40 opacity0"
					:class="$route.params.id === store.id.value ? `` : `ml-6`"
				>
					<div class="flex flex-row items-center">
						<button
							class="focus:outline-none"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
							@click="showAvatar"
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
						<span v-if="store.id.value === $route.params.id" class="w-full h-full">
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
							v-if="store.id.value !== $route.params.id && paymentsEnabled()"
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
				<div
					id="infos"
					class="header-profile flex items-center"
					:class="$route.params.id === store.id.value ? `-mt-12` : ``"
				>
					<button class="focus:outline-none" @click="showAvatar">
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
									>{{ followers.size }}</span
								>
								Followers
							</button>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
								@click="$emit(`openFollowing`)"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ following.size }}</span
								>
								Following
							</button>
						</div>
					</div>
				</div>
				<!-- Profile buttons -->
				<div
					id="buttons"
					class="header-profile h-fit flex items-center xl:h-auto"
					:class="$route.params.id === store.id.value ? `-mt-12` : ``"
				>
					<!-- Edit profile button -->
					<span v-if="store.id.value === $route.params.id">
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
						v-if="store.id.value !== $route.params.id && paymentsEnabled()"
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
				<router-link :to="'/id/' + $route.params.id" class="pb-1" :class="getStyles('id-id')">
					<span class="px-4">Posts</span>
				</router-link>
				<router-link :to="'/id/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('id-id-comments')">
					<span class="px-4">Comments</span>
				</router-link>
				<router-link :to="'/id/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('id-id-reposts')">
					<span class="px-4">Reposts</span>
				</router-link>
			</div>
		</article>
		<div
			v-if="loadedContent()"
			id="scrollContainer"
			ref="scrollContainer"
			class="w-full overflow-y-auto"
			:style="
				!scrollingDown
					? `min-height: calc(100vh - ` + `290px` + `); height: calc(100vh - ` + `290px` + `)`
					: `min-height: calc(100vh - ` + `150px` + `); height: calc(100vh - ` + `150px` + `)`
			"
		>
			<nuxt-child
				:profile="visitProfile"
				:update-followers="updateFollowers"
				:followers="followers"
				:mutuals="mutuals"
				:mutual-profiles="mutualProfiles"
				:toggle-friend="toggleFriend"
				:user-is-followed="userIsFollowed"
			/>
		</div>
		<!-- Settings popup -->
		<div
			v-if="showSettings"
			class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<SettingsPopup
				class="overflow-y-auto min-h-40 max-h-90 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg"
				:update-profile-method="updateProfileMethod"
				@close="toggleSettings"
			/>
		</div>
		<BioPopup
			v-if="expandBio"
			:bio="visitProfile.bio"
			:authorname="visitProfile.name"
			:author-i-d="visitProfile.id"
			@close="expandBio = false"
		/>
		<portal-target name="bioPopup"></portal-target>
	</section>
</template>
<style>
.header-profile {
	transition: all 0.4s;
	/* z-index: 50; */
}
.headercollapsed {
	min-height: 1rem !important;
	height: 4rem !important;
}
.headernotcollapsed {
	opacity: 1;
}
.opacity0 {
	opacity: 0;
}
.opacity1 {
	opacity: 1;
}
</style>
