<script setup lang="ts">
import Logo from './icons/CapsuleLogo.vue';
import MobileNav from './icons/MobileNav.vue';
import HomeIcon from './icons/Home.vue';
import DiscoverIcon from './icons/Discover.vue';
import BookmarksIcon from './icons/BookmarkIcon.vue';
import DashboardIcon from './icons/OverviewIcon.vue';
import Crown2Icon from './icons/CrownEmptyIcon.vue';
import Avatar from './../components/Avatar.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../store/session';
import { useStoreSettings } from '@/store/settings';
import ProfileIcon from './icons/ProfileIcon.vue';
import SettingsIcon from './icons/SettingsIcon.vue';
import LogoutIcon from './icons/LogoutIcon.vue';
import { useDraftStore } from '@/store/drafts';

const sessionStore = useStore();
const settings = useStoreSettings();
const router = useRouter();
const draftStore = useDraftStore();

const showMobileMenu = ref(false);
const showDropdown = ref(false);
const url = ref(window.location.origin);

// Auto-close event listener (only works with @click.stop to prevent bubbling)
onMounted(() => {
	window.addEventListener(`click`, (e) => {
		if (!e) {
			return;
		}
		if (showMobileMenu.value) {
			showMobileMenu.value = false;
		}
		if (showDropdown.value) {
			showDropdown.value = false;
		}
	});
});

function goWrite() {
	draftStore.createNewDraft();
	router.push(`/write`);
}

function toggleDropdown() {
	showDropdown.value = !showDropdown.value;
}

function toggleMobileMenu() {
	showMobileMenu.value = !showMobileMenu.value;
}

function logout() {
	localStorage.clear();
	window.location.replace(url.value + `/login`);
}
</script>

<template>
	<header
		class="sticky top-0 w-full bg-gradient-to-r px-3 lg:px-0 z-10"
		:class="showMobileMenu || showDropdown ? `z-20` : ``"
	>
		<!-- Desktop header -->
		<nav class="w-full flex-no-wrap hidden flex-row items-center justify-between py-5 lg:flex">
			<!-- Left side: Logo, links -->
			<div class="flex flex-row items-center" style="font-size: 0.95rem">
				<router-link to="/home" class="mr-5 text-lightSecondaryText dark:text-gray1">
					<Logo />
				</router-link>
				<router-link
					to="/home"
					class="mx-4 transition duration-500 ease-in-out hover:text-primary"
					:class="
						router.currentRoute.value.name === `Home`
							? `text-primary font-semibold`
							: `text-gray5 dark:text-gray3 font-regular`
					"
					:style="router.currentRoute.value.name === `Home` ? `padding: 0` : `padding: 0 0.0341rem`"
					>Home</router-link
				>
				<router-link
					to="/discover"
					class="mx-4 transition duration-500 ease-in-out hover:text-primary"
					:class="
						router.currentRoute.value.name === `Discover`
							? `text-primary font-semibold`
							: `text-gray5 dark:text-gray3 font-regular`
					"
					:style="router.currentRoute.value.name === `Discover` ? `padding: 0` : `padding: 0 0.075rem`"
					>Discover</router-link
				>
				<router-link
					to="/bookmarks"
					class="mx-4 transition duration-500 ease-in-out hover:text-primary"
					:class="
						router.currentRoute.value.name === `Bookmarks`
							? `text-primary font-semibold`
							: `text-gray5 dark:text-gray3 font-regular`
					"
					:style="router.currentRoute.value.name === `Bookmarks` ? `padding: 0` : `padding: 0 0.111rem`"
					>Bookmarks</router-link
				>
				<button
					to="/write"
					style="padding: 0.6rem 1.7rem"
					class="mx-4 bg-primary dark:bg-secondary text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
					@click="goWrite"
				>
					Write a Post
				</button>
			</div>
			<!-- Right side: avatar & icons -->
			<div class="relative flex flex-row">
				<button class="dropdown focus:outline-none" @click.stop="toggleDropdown()">
					<Avatar
						class="dropdown"
						:cid="
							sessionStore.$state.id === ``
								? require(`./../assets/images/avatars/unauthenticated.webp`)
								: sessionStore.$state.avatar
						"
						:authorid="sessionStore.$state.id"
						:override="
							sessionStore.$state.id === `` ? require(`./../assets/images/avatars/unauthenticated.webp`) : null
						"
						:no-click="true"
						:size="`w-10 h-10 xl:w-12 xl:h-12`"
					/>
				</button>
				<!-- Dropdown: Profile, settings, disconnect -->
				<div
					v-show="showDropdown"
					class="w-max from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation absolute mt-16 flex flex-col rounded-lg border bg-gradient-to-r p-4 shadow-lg backdrop-blur-lg backdrop-filter right-0"
					:class="settings.isDarkMode ? `dropdownOpenDark` : `dropdownOpen`"
				>
					<!-- Unauthenticated: Log in -->
					<a
						v-if="sessionStore.$state.id === ``"
						:href="url + `/login`"
						class="text-gray5 dark:text-gray3 mx-2 mb-4 flex w-24 flex-row items-center text-left"
						>Log In</a
					>
					<!-- Unauthenticated: Register -->
					<a
						v-if="sessionStore.$state.id === ``"
						:href="url + `/register`"
						class="text-gray5 dark:text-gray3 mx-2 flex w-24 flex-row items-center text-left"
						>Register</a
					>
					<!-- Authenticated -->
					<div v-if="sessionStore.$state.id !== ``" class="flex items-center">
						<div class="flex flex-col items-start">
							<p class="text-lg text-lightPrimaryText dark:text-darkPrimaryText font-semibold -mt-1">
								{{ sessionStore.$state.name }}
							</p>
							<p class="text-sm text-primary">@{{ sessionStore.$state.id }}</p>
						</div>
					</div>
					<div
						v-if="sessionStore.$state.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<router-link
						v-if="sessionStore.$state.id !== ``"
						:to="`/id/` + sessionStore.$state.id"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
						><ProfileIcon class="mr-2 h-5 w-5 flex-shrink-0" />Profile</router-link
					>
					<a
						v-if="sessionStore.$state.id !== ``"
						href="https://blogchain.app/authordashboard"
						target="_blank"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
						><DashboardIcon class="mr-2 h-5 w-5 flex-shrink-0" />Author Dashboard</a
					>
					<div
						v-if="sessionStore.$state.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<a
						v-if="sessionStore.$state.id !== ``"
						:href="url + `/subscriptions`"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
					>
						<Crown2Icon class="mr-2 h-5 w-5 flex-shrink-0" />Subscriptions</a
					>
					<div
						v-if="sessionStore.$state.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<a
						v-if="sessionStore.$state.id !== ``"
						:href="url + `/settings/account`"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
					>
						<SettingsIcon class="mr-2 h-5 w-5 flex-shrink-0" />Settings</a
					>
					<!-- What to do to disconnect here? -->
					<button
						v-if="sessionStore.$state.id !== ``"
						class="focus:outline-none text-negative flex w-full flex-row items-center text-left"
						@click="logout"
					>
						<LogoutIcon class="mr-2 h-5 w-5 flex-shrink-0" />Disconnect
					</button>
				</div>
			</div>
		</nav>
		<!-- Mobile header -->
		<nav class="flex w-full items-center justify-between p-2 lg:hidden">
			<!-- Mobile menu dropdown -->
			<div class="relative">
				<button class="mobileDropdown" @click.stop="toggleMobileMenu()">
					<MobileNav class="mobileDropdown text-lightSecondaryText dark:text-gray1" />
				</button>
				<div
					v-show="showMobileMenu"
					class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation absolute mt-4 -ml-1 flex flex-col rounded-lg border bg-gradient-to-r p-4 shadow-lg backdrop-blur-lg backdrop-filter"
					:class="settings.isDarkMode ? `dropdownMainOpenDark` : `dropdownMainOpen`"
				>
					<a
						:href="url + `/home`"
						class="mb-4 flex w-full flex-row items-center border-none text-left font-regular text-gray5 dark:text-gray3"
					>
						<HomeIcon class="mr-2 h-5 w-5 flex-shrink-0" />Home</a
					>
					<a
						:href="url + `/discover`"
						class="mb-4 flex w-full flex-row items-center border-none text-left font-regular text-gray5 dark:text-gray3"
					>
						<DiscoverIcon class="mr-2 h-5 w-5 flex-shrink-0" />Discover</a
					>
					<a
						:href="url + `/bookmarks`"
						class="flex w-full flex-row items-center border-none text-left font-regular text-gray5 dark:text-gray3"
					>
						<BookmarksIcon class="mr-2 h-5 w-5 flex-shrink-0" />Bookmarks</a
					>
				</div>
			</div>
			<!-- Middle branding -->
			<a :href="url + `/home`">
				<div class="flex items-center">
					<Logo class="text-lightSecondaryText dark:text-gray1 mr-2" />
				</div>
			</a>
			<!-- Right side: avatar & icons -->
			<div class="relative flex flex-row">
				<button class="dropdown focus:outline-none" @click.stop="toggleDropdown()">
					<Avatar
						class="dropdown"
						:cid="
							sessionStore.$state.id === ``
								? require(`./../assets/images/avatars/unauthenticated.webp`)
								: sessionStore.$state.avatar
						"
						:authorid="sessionStore.$state.id"
						:override="
							sessionStore.$state.id === `` ? require(`./../assets/images/avatars/unauthenticated.webp`) : null
						"
						:no-click="true"
						:size="`w-10 h-10 xl:w-12 xl:h-12`"
					/>
				</button>
				<!-- Dropdown: Profile, settings, disconnect -->
				<div
					v-show="showDropdown"
					class="w-max from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation absolute mt-16 flex flex-col rounded-lg border bg-gradient-to-r p-4 shadow-lg backdrop-blur-lg backdrop-filter right-0"
					:class="settings.isDarkMode ? `dropdownOpenDark` : `dropdownOpen`"
				>
					<!-- Unauthenticated: Log in -->
					<a
						v-if="sessionStore.$state.id === ``"
						:href="url + `/login`"
						class="text-gray5 dark:text-gray3 mx-2 mb-4 flex w-24 flex-row items-center text-left"
						>Log In</a
					>
					<!-- Unauthenticated: Register -->
					<a
						v-if="sessionStore.$state.id === ``"
						:href="url + `/register`"
						class="text-gray5 dark:text-gray3 mx-2 flex w-24 flex-row items-center text-left"
						>Register</a
					>
					<!-- Authenticated -->
					<div v-if="sessionStore.$state.id !== ``" class="flex items-center">
						<div class="flex flex-col items-start">
							<p class="text-lg text-lightPrimaryText dark:text-darkPrimaryText font-semibold -mt-1">
								{{ sessionStore.$state.name }}
							</p>
							<p class="text-sm text-primary">@{{ sessionStore.$state.id }}</p>
						</div>
					</div>
					<div
						v-if="sessionStore.$state.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<router-link
						v-if="sessionStore.$state.id !== ``"
						:to="`/id/` + sessionStore.$state.id"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
						><ProfileIcon class="mr-2 h-5 w-5 flex-shrink-0" />Profile</router-link
					>
					<a
						v-if="sessionStore.$state.id !== ``"
						href="https://blogchain.app/authordashboard"
						target="_blank"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
						><DashboardIcon class="mr-2 h-5 w-5 flex-shrink-0" />Author Dashboard</a
					>
					<div
						v-if="sessionStore.$state.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<a
						v-if="sessionStore.$state.id !== ``"
						:href="url + `/subscriptions`"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
					>
						<Crown2Icon class="mr-2 h-5 w-5 flex-shrink-0" />Subscriptions</a
					>
					<div
						v-if="sessionStore.$state.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<a
						v-if="sessionStore.$state.id !== ``"
						:href="url + `/settings/account`"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
					>
						<SettingsIcon class="mr-2 h-5 w-5 flex-shrink-0" />Settings</a
					>
					<!-- What to do to disconnect here? -->
					<button
						v-if="sessionStore.$state.id !== ``"
						class="focus:outline-none text-negative flex w-full flex-row items-center text-left"
					>
						<LogoutIcon class="mr-2 h-5 w-5 flex-shrink-0" />Disconnect
					</button>
				</div>
			</div>
		</nav>
	</header>
</template>

<style>
.dropdownOpen {
	margin-left: -6rem;
	backdrop-filter: blur(10px);
}
.dropdownOpenDark {
	margin-left: -6rem;
	backdrop-filter: blur(10px);
}
.dropdownOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: rgba(46, 46, 46, 0.95);
	border-radius: 2px;
}
.dropdownMainOpen {
	margin-top: 1rem !important;
	margin-left: -1rem !important;
	backdrop-filter: blur(10px);
}
.dropdownMainOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownMainOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: rgba(46, 46, 46, 0.95);
	border-radius: 2px;
}
</style>
