<script setup lang="ts">
import { useStore } from '../store/session'
import Nodes from './Nodes.vue'

const store = useStore()
</script>
<template>
	<div class="modal-animation hidden lg:flex w-full items-center justify-between px-3 lg:px-0" style="height: 62px">
		<!-- Home -->
		<div v-if="$route.name === `Home`">
			<h1
				v-if="store.$state.name"
				class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl font-serif"
			>
				Hello, {{ store.$state.name === `` ? `@` + store.$state.id : store.$state.name }}
			</h1>
			<h1 v-else class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl font-serif">
				Hello!
			</h1>
		</div>
		<!-- Discover -->
		<div v-if="$route.name === `Discover`">
			<h1 class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl font-serif">
				Browse Blogchain
			</h1>
		</div>
		<!-- Bookmarks -->
		<div v-if="$route.name === `Bookmarks`">
			<h1 class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl font-serif">
				Bookmarks list
			</h1>
		</div>
		<Nodes />
	</div>
</template>
