<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref<string>(``)
const theDate = new Date()
currentYear.value = theDate.getFullYear().toString()
</script>

<template>
	<footer class="text-gray5 dark:text-gray3 text-sm">
		<div class="mb-5 mt-1 flex flex-wrap">
			<router-link to="/help" class="pr-6 mb-2">Help</router-link>
			<router-link to="/content-policy" class="pr-6 mb-2">Content Policy</router-link>
			<router-link to="/payment-policy" class="pr-6">Payment Policy</router-link>
			<a href="https://www.capsule.social/writers" target="_blank" class="pr-6 mb-2">Writers</a>
			<a href="https://blogchain.app/id/capsule" class="pr-6 mb-2">Blog</a>
			<a href="https://discord.gg/HhVbaD2BHY" target="_blank" class="pr-6">Discord</a>
			<a href="https://www.capsule.social/careers" target="_blank" class="pr-6">Careers</a>
			<a href="https://www.iubenda.com/terms-and-conditions/40723363" target="_blank" class="pr-6">Terms</a>
			<a href="https://www.capsule.social/about/overview" target="_blank" class="pr-6">About</a>
		</div>
		<p>© {{ currentYear }} Capsule Social, Inc.</p>
	</footer>
</template>
