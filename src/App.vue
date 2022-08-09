<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
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

const store = useStore();
const settings = useStoreSettings();
const avatar = ref<string>(``);
const unauthRoutes = ref<string[]>([`Login`, `Register`]);
const fullPageRoutes = ref<string[]>([`Payment Policy`, `Content Policy`]);
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

/** This is high-level function.
 * It must react to delta being more/less than zero.
 */
function handle(delta: number) {
	const target = document.getElementById(`scrollable_content`) as HTMLElement
	const speed = 15
	const top = target.scrollTop - delta * speed
	target.scrollTop = delta < 0 ? Math.ceil(top) : Math.floor(top)
}

/** Event handler for mouse wheel event.
 */
function wheel(event: any) {
	let delta = 0
	if (!event) /* For IE. */ event = window.event
	if (event.wheelDelta) {
		/* IE/Opera. */
		delta = event.wheelDelta / 120
	} else if (event.detail) {
		/** Mozilla case. */
		/** In Mozilla, sign of delta is different than in IE.
		 * Also, delta is multiple of 3.
		 */
		delta = -event.detail / 3
	}

	/** If delta is nonzero, handle it.
	 * Basically, delta is now positive if wheel was scrolled up,
	 * and negative, if wheel was scrolled down.
	 */
	console.log(delta)
	if (delta) handle(delta)

	/** Prevent default actions caused by mouse wheel.
	 * That might be ugly, but we handle scrolls somehow
	 * anyway, so don't bother here..
	 */
	// if (event.preventDefault) event.preventDefault()
	event.returnValue = false
}

// Run init methods
onBeforeMount(() => {
	store.login();
	settings.sync();
	initColors();
	getAvatar(store.$state.avatar);
});

// onMounted(async () => {
// 	if (!store.$state.id) {
// })

/** Event listener for mouse wheel event,
 * only for screens > 1024px (:lg size of tailwind where we hide side bar).
 */
if (window.screen.availWidth > 1024) {
	if (window.addEventListener) window.addEventListener('wheel', wheel, false)
}
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
