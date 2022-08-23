<script setup lang="ts">
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import BrushIcon from '@/components/icons/Brush.vue';
</script>
<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border py-4 px-6 pb-2 shadow-lg"
	>
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Settings</h3>
		<router-link
			:class="
				$route.name === `Account`
					? `bg-lightInput dark:bg-darkInput font-semibold text-primary`
					: `text-gray5 dark:text-gray3`
			"
			class="focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left flex flex-row items-center"
			to="/settings/account"
		>
			<ProfileIcon class="w-4 h-4" />
			<p class="ml-4">Account</p>
		</router-link>
		<router-link
			to="/settings/styling"
			:class="
				$route.name === `Styling`
					? `bg-lightInput dark:bg-darkInput font-semibold text-primary`
					: `text-gray5 dark:text-gray3`
			"
			class="focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left flex flex-row items-center"
		>
			<BrushIcon class="w-4 h-4" />
			<p class="ml-4">Appearance and Styling</p>
		</router-link>
	</div>
</template>
