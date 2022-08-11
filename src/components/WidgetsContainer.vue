<script setup lang="ts">
import HomeWidgets from '@/components/widgets/HomeWidgets.vue';
import DiscoverWidgets from '@/components/widgets/DiscoverWidgets.vue';
import Footer from '@/components/Footer.vue';
</script>
<template>
	<aside
		class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 lg:block"
		:style="`min-height: calc(100vh - 150px); height: calc(100vh - 80px)`"
	>
		<HomeWidgets v-if="$route.name === `Home`" />
		<DiscoverWidgets v-if="$route.name === `Discover`" />
		<Footer />
	</aside>
</template>
