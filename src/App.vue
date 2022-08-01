<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import TopHeader from './components/TopHeader.vue'
import WidgetsContainer from './components/WidgetsContainer.vue'

import { useStore } from './store/session'
import { useStoreSettings } from './store/settings'
import { initColors } from './plugins/colors'
import { getBGImage } from './plugins/background'
import { setColorMode } from './plugins/colormode'
import { onBeforeMount, ref } from 'vue'
import { useMeta } from 'vue-meta'
// import { useRouter } from 'vue-router'

const store = useStore()
const settings = useStoreSettings()
const avatar = ref<string>(``)
const unauthRoutes = ref<string[]>([`Login`, `Register`])
const fullPageRoutes = ref<string[]>([`Payment Policy`, `Content Policy`])
// const router = useRouter()

// meta tags

useMeta({
	title: '',
	htmlAttrs: { lang: 'en', amp: true },
})

// Methods
function getAvatar(cid: string) {
	if (cid === ``) {
		return
	}
}
// Run init methods
onBeforeMount(() => {
	store.login()
	settings.sync()
	setColorMode(settings.mode)
	initColors()
	getAvatar(store.$state.avatar)
})

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
	<!-- wrapper -->
	<main
		v-else
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="{
			backgroundImage: `url(` + getBGImage(store.background) + `)`,
		}"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex flex-col w-full lg:w-11/12 xl:w-10/12 max-w-1220">
				<TopHeader :name="store.name" :avatar="avatar" />
				<!-- Body -->
				<section class="modal-animation flex flex-row">
					<div
						:class="fullPageRoutes.includes($route.name as string) ? `w-full` : `lg:w-7.5`"
						class="min-h-80 h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border border-lightBorder z-10 w-full overflow-y-auto rounded-t-lg bg-gradient-to-r shadow-lg"
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
