<script setup lang="ts">
import TopHeader from './components/TopHeader.vue';
import WidgetsContainer from './components/WidgetsContainer.vue';
import '@/assets/css/tailwind.css';
import TitleContainer from './components/TitleContainer.vue';

import { useStore } from './store/session';
import { useStoreSettings } from './store/settings';
import { initColors } from './plugins/colors';
import { getBGImage } from './plugins/background';
import { onBeforeMount, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { wheel } from '@/helpers/scrolling';
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();
const store = useStore();
const settings = useStoreSettings();
const avatar = ref<string>(``);
const unauthRoutes = ref<string[]>([`Login`, `Register`]);
const fullPageRoutes = ref<string[]>([`Payment Policy`, `Content Policy`, `Not Found`]);
const routesWithTitle = ref<string[]>([`Home`, `Discover`, `Bookmarks`]);

// meta tags
useMeta({
	title: '',
	htmlAttrs: { lang: 'en', amp: true },
});

// Methods
function getAvatar(cid: string) {
	if (cid === ``) {
		return;
	}
}

// Run init methods
onBeforeMount(() => {
	store.login();
	settings.sync();
	initColors();
	getAvatar(store.$state.avatar);
});

watch(router.currentRoute, () => {
	// Scrolling event listener
	document.addEventListener('DOMContentLoaded', () => {
		// Query elements
		const content = document.getElementById('scrollable_content') as HTMLElement;
		const track = document.getElementById('track') as HTMLElement;
		const thumb = document.getElementById('thumb') as HTMLElement;

		// Set the initial height for thumb
		const scrollRatio = content.clientHeight / content.scrollHeight;
		thumb.style.height = `${scrollRatio * 100}%`;

		let pos = { top: 0, y: 0 };

		const mouseDownThumbHandler = function (e: any) {
			pos = {
				// The current scroll
				top: content.scrollTop,
				// Get the current mouse position
				y: e.clientY,
			};

			thumb.classList.add('cursor-grab', 'select-none', 'bg-gray5');
			document.body.classList.add('cursor-grab', 'select-none');

			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};

		const mouseMoveHandler = function (e: any) {
			// How far the mouse has been moved
			const dy = e.clientY - pos.y;

			// Scroll the content
			content.scrollTop = pos.top + dy / scrollRatio;
			thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
		};

		const mouseUpHandler = function (e: any) {
			thumb.classList.remove('cursor-grab', 'select-none', 'bg-gray5');
			document.body.classList.remove('cursor-grab', 'select-none');

			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};

		const trackClickHandler = function (e: any) {
			const bound = track.getBoundingClientRect();
			const percentage = (e.clientY - bound.top) / bound.height;
			content.scrollTop = percentage * (content.scrollHeight - content.clientHeight);
			thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
		};

		if (window.screen.availWidth > 1024) {
			if (window.addEventListener) window.addEventListener('wheel', wheel);
			if (thumb.addEventListener) thumb.addEventListener('mousedown', mouseDownThumbHandler);
			if (track.addEventListener) track.addEventListener('click', trackClickHandler);
		}
	});
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
				<TopHeader :name="store.name" :avatar="avatar" />
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
