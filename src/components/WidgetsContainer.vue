<script setup lang="ts">
import HomeWidgets from '@/components/widgets/HomeWidgets.vue';
import Footer from '@/components/Footer.vue';
</script>
<template>
	<aside class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 pb-32 lg:block min-h-61 h-61">
		<HomeWidgets v-if="$route.name === `Home`" />
		<Footer />
	</aside>
</template>
