<script setup lang="ts">
import TopHeader from './components/TopHeader.vue';
import WidgetsContainer from './components/WidgetsContainer.vue';
import UnauthPopup from '@/components/popups/UnauthPopup.vue';
import '@/assets/css/tailwind.css';
import TitleContainer from './components/TitleContainer.vue';

import { useStore } from './store/session';
import { useStoreSettings } from './store/settings';
import { useConnectionsStore } from '@/store/connections';
import { useRootStore } from '@/store/index';
import { initColors } from './plugins/colors';
import { getBGImage } from './plugins/background';
import { onBeforeMount, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { setThumbHeight, initScroll } from '@/helpers/scrolling';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { nextTick } from 'process';
import { useProfilesStore } from '@/store/profiles';

const router = useRouter();
const store = useStore();
const settings = useStoreSettings();
const connections = useConnectionsStore();
const profile = useProfilesStore();
const rootStore = useRootStore();

const unauthRoutes = ref<string[]>([`Login`, `Register`]);
const fullPageRoutes = ref<string[]>([`Payment Policy`, `Content Policy`, `Not Found`, `Post Reader`]);
const routesWithTitle = ref<string[]>([`Home`, `Discover`, `Bookmarks`]);

// meta tags
useMeta({
	title: '',
	htmlAttrs: { lang: 'en', amp: true },
});

// Run init methods
onBeforeMount(() => {
	store.login();
	settings.sync();
	initColors();
	if (store.id === ``) {
		return;
	}
	connections.fetchConnections(store.id);
	profile.fetchProfile(store.id);
});

const setScroll = () => {
	// Scrolling event listener
	document.removeEventListener('DOMContentLoaded', initScroll);
	document.addEventListener('DOMContentLoaded', initScroll);
	nextTick(setThumbHeight);
};

watch(router.currentRoute, () => {
	setScroll();
});
</script>

<template>
	<metainfo>
		<template #title="{ content }">{{ `${content}` }}</template>
	</metainfo>

	<!-- Full screen pages -->
	<router-view v-if="unauthRoutes.includes($route.name as string)" :key="$route.path" />
	<!-- wrapper -->
	<main
		v-else
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="{
			backgroundImage: `url(` + getBGImage(store.background) + `)`,
		}"
		style="overscroll-behavior-y: none; scroll-behavior: smooth"
	>
		<!-- scrollbar -->
		<div
			id="scrollbar"
			class="bg-gray1 bg-opacity-50 hidden absolute w-4 top-0 right-0 h-full lg:flex justify-center border-l border-gray1"
		>
			<div id="track" class="h-full left-0 absolute top-0 w-full"></div>
			<div
				id="thumb"
				class="bg-gray3 rounded cursor-grab center absolute w-6/12 hover:cursor-grab transition duration-300 ease-in-out hover:bg-gray5"
			></div>
		</div>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex flex-col w-full lg:w-11/12 xl:w-10/12 max-w-1220">
				<TopHeader />
				<!-- Body -->
				<TitleContainer v-if="routesWithTitle.includes($route.name as string)" />
				<section class="modal-animation flex flex-row">
					<div
						:class="fullPageRoutes.includes($route.name as string) ? `w-full` : `lg:w-7.5`"
						class="min-h-61 h-61 bg-lightBG dark:bg-darkBGStop border border-lightBorder z-10 w-full overflow-y-hidden rounded-t-lg shadow-lg relative"
					>
						<router-view :key="$route.path" />
					</div>
					<WidgetsContainer v-if="!fullPageRoutes.includes($route.name as string)" />
				</section>
			</div>
		</div>
	</main>
	<UnauthPopup v-if="rootStore.$state.showUnauthPopup" />
	<div id="popup"></div>
</template>

<style>
html {
	position: fixed;
	height: 100%;
	overflow: hidden;
}

body {
	width: 100vw;
	height: 100vh;
	overflow-y: scroll;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
}
</style>
