<script setup lang="ts">
import ChevronLeft from '@/components/icons/ChevronLeft.vue';

import { useRouter } from 'vue-router';
import { useStore } from '@/store/session';
import { onMounted } from 'vue';

const store = useStore();
const router = useRouter();

onMounted(() => {
	if (!store.$state.id) {
		router.push(`/home`);
	}
});
</script>

<template>
	<!-- Mobile back button -->
	<router-link v-if="$route.name !== `Settings`" to="/settings" class="mb-2 flex items-center lg:hidden px-6 pt-4">
		<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
		<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
	</router-link>
	<router-view></router-view>
</template>
