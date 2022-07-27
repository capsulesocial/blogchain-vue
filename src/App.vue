<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import TopHeader from './components/TopHeader.vue'
import SideNav from './components/SideNav.vue'
import Footer from './components/Footer.vue'
import Ressouces from './components/Ressources.vue'

import { useStore } from './store/session'
import { useStoreSettings } from './store/settings'
import { initColors } from './plugins/colors'
import { getBGImage } from './plugins/background'
import { setColorMode } from './plugins/colormode'
import { onBeforeMount, ref } from 'vue'
// import { useRouter } from 'vue-router'

const store = useStore()
const settings = useStoreSettings()
const avatar = ref<string>(``)
const fullPageRoutes = ref<string[]>([`Login`, `Register`])
// const router = useRouter()

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
	<!-- Full screen pages -->
	<router-view v-if="fullPageRoutes.includes($route.name as string)" :key="$route.path" />
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
						class="lg:w-7.5 min-h-80 h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border border-lightBorder z-10 w-full overflow-y-auto rounded-t-lg bg-gradient-to-r p-6 pt-4 pb-0 shadow-lg"
					>
						<router-view :key="$route.path" />
					</div>
					<aside
						class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 lg:block"
						:style="`min-height: calc(100vh - 150px); height: calc(100vh - 80px)`"
					>
						<SideNav
							class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg"
							style="backdrop-filter: blur(10px)"
						/>
						<Ressouces />
						<Footer />
					</aside>
				</section>
			</div>
		</div>
	</main>
	<div id="popup"></div>
</template>
