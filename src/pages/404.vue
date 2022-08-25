<script setup lang="ts">
import BrandedButton from '@/components/BrandedButton.vue';
</script>

<template>
	<div class="items-ceter flex w-full flex-col p-5">
		<h1 class="text-negative mt-16 text-center font-sans text-6xl font-bold mb-8">404</h1>
		<h2 class="text-center text-2xl font-semibold dark:text-darkPrimaryText">This page was not found</h2>
		<p class="text-gray5 dark:text-gray3 mb-5 mt-2 self-center text-center" style="width: 360px">
			It seems that this page doesn't exist. How about navigating back home?
		</p>
		<div class="flex justify-center">
			<BrandedButton
				:action="
					() => {
						$router.push(`/home`);
					}
				"
				:text="`Back to Home`"
			/>
		</div>
		<img
			v-lazy="{ src: require(`@/assets/images/brand/error.webp`) }"
			alt="error image"
			class="mt-10 self-center"
			style="width: 500px"
		/>
	</div>
</template>
