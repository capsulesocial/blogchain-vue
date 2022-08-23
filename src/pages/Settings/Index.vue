<script setup lang="ts">
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
</script>

<template>
	<!-- Mobile back button -->
	<router-link v-if="$route.name !== `Settings`" to="/settings" class="mb-6 flex items-center lg:hidden">
		<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
		<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
	</router-link>
	<router-view></router-view>
</template>
