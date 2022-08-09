<script setup lang="ts">
import ChevronLeftIcon from '../components/icons/ChevronLeft.vue';
</script>
<template>
	<!-- Mobile back button -->
	<router-link to="/" class="mb-6 flex items-center lg:hidden">
		<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeftIcon /></span>
		<h6 class="font-semibold dark:text-darkPrimaryText">Dashboard</h6>
	</router-link>
</template>
