<script setup lang="ts">
import { useStore } from '../store/session';
import Nodes from './Nodes.vue';

const store = useStore();
</script>
<template>
	<div
		class="modal-animation hidden lg:flex w-full items-center justify-between px-3 lg:px-0 lg:mb-2 xl:mb-5"
		style="height: 62px"
	>
		<!-- Home -->
		<div v-if="$route.name === `Home`">
			<h1 v-if="store.$state.id" class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl">
				Hello, {{ store.$state.name === `` ? `@${store.$state.id}` : store.$state.name }}
			</h1>
			<h1 v-else class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl">Hello!</h1>
		</div>
		<!-- Discover -->
		<div v-if="$route.name === `Discover`">
			<h1 class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl">Browse Blogchain</h1>
		</div>
		<!-- Bookmarks -->
		<div v-if="$route.name === `Bookmarks`">
			<h1 class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl">Bookmarks list</h1>
		</div>
		<Nodes />
	</div>
</template>
