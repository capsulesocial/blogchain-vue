<script setup lang="ts">
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import BrushIcon from '@/components/icons/Brush.vue';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import BellIcon from '@/components/icons/BellIcon.vue';
</script>
<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation flex flex-col overflow-hidden rounded-lg border py-4 px-6 pb-2 shadow-lg"
	>
		<h3 class="text-primary pb-4 text-base font-semibold">Settings</h3>
		<router-link
			:class="$route.name === `settings-account` ? `bg-lightInput font-semibold` : ``"
			class="text-gray5 dark:text-gray3 focus:outline-none mb-2 flex w-full items-center justify-between rounded-lg py-2 text-left"
			to="/settings/account"
		>
			<div class="flex flex-row items-center">
				<ProfileIcon class="w-4 h-4" />
				<h6 class="ml-4">Account</h6>
			</div>
			<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><ChevronRight /></span>
		</router-link>
		<router-link
			to="/settings/notifications"
			:class="$route.name === `Notifications` ? `bg-lightInput font-semibold` : ``"
			class="text-gray5 dark:text-gray3 focus:outline-none mb-2 flex w-full items-center justify-between rounded-lg py-2 text-left"
		>
			<div class="flex flex-row items-center">
				<BellIcon class="w-4 h-4" />
				<h6 class="ml-4">Notifications</h6>
			</div>
			<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><ChevronRight /></span>
		</router-link>
		<router-link
			to="/settings/styling"
			:class="$route.name === `settings-styling` ? `bg-lightInput font-semibold` : ``"
			class="text-gray5 dark:text-gray3 focus:outline-none mb-2 flex w-full items-center justify-between rounded-lg py-2 text-left"
		>
			<div class="flex flex-row items-center">
				<BrushIcon class="w-4 h-4" />
				<h6 class="ml-4">Appearance and Styling</h6>
			</div>
			<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><ChevronRight /></span>
		</router-link>
	</div>
</template>
