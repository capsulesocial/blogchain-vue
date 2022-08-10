<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import TopHeader from './components/TopHeader.vue';
import WidgetsContainer from './components/WidgetsContainer.vue';
import '@/assets/css/tailwind.css';
import TitleContainer from './components/TitleContainer.vue';
import PostHeader from './pages/PostHeader.vue';

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
</script>
<template>
	<metainfo>
		<template #title="{ content }">{{ `${content}` }}</template>
	</metainfo>

	<!-- Full screen pages -->
	<router-view v-if="unauthRoutes.includes($route.name as string)" :key="$route.path" />

	<div
		class="w-full sticky top-0 h-38 z-50 bg-img bg-lightBG dark:bg-darkBG"
		:style="{
			backgroundImage: `url(` + getBGImage(store.background) + `)`,
		}"
	>
		<div class="m-auto self-center w-full lg:w-11/12 xl:w-10/12 max-w-1220">
			<TopHeader :name="store.name" :avatar="avatar" />
			<!-- Body -->
			<TitleContainer v-if="routesWithTitle.includes($route.name as string)" />
		</div>
	</div>
	<!-- wrapper -->
	<main
		class="bg-img h-screen p-0 bg-lightBG dark:bg-darkBG justify-center flex scroll-container"
		:style="{
			backgroundImage: `url(` + getBGImage(store.background) + `)`,
		}"
	>
		<div class="flex justify-between" :class="fullPageRoutes.includes($route.name as string) ? `w-full` : `lg:w-7.5`">
			<div class="main flex flex-col w-full">
				<PostHeader class="z-40 bg-img bg-lightBG dark:bg-darkBG flex fixed w-4.5" />
				<div class="relative">
					<div class="flex w-full justify-center flex-row">
						<div class="flex flex-col w-full lg:w-11/12 xl:w-10/12 max-w-1220">
							<section class="modal-animation flex flex-row lg:mt-2 xl:mt-5">
								<div
									class="min-h-80 h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border border-lightBorder z-10 w-full rounded-t-lg bg-gradient-to-r shadow-lg"
								>
									<router-view :key="$route.path" />
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>

			<div class="sticky top-40 h-10">
				<WidgetsContainer v-if="!fullPageRoutes.includes($route.name as string)" />
			</div>
		</div>
	</main>
	<div id="popup"></div>
</template>
