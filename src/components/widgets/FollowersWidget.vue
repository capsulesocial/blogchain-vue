<script setup lang="ts">
import { ref } from 'vue';
import type { Profile } from '@/backend/profile';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import FollowersPopup from '@/components/popups/FollowersPopup.vue';

const openFollowersPopup = ref<boolean>(false);

// TODO: fetch followers from store / backend
const followers = ref<Profile[]>([
	{
		id: `oiahefoiheoafheaf`,
		name: `Tom Brady`,
		email: `tb12@gmail.com`,
		bio: `6-time super bowl champion`,
		location: `Tampa Bay`,
		avatar: ``,
		socials: [],
		website: `tb12.com`,
	},
	{
		id: `fziohogheabfhoeaof`,
		name: `Tom Not Brady`,
		email: `tb12@gmail.com`,
		bio: `6-time super bowl champion`,
		location: `Tampa Bay`,
		avatar: ``,
		socials: [],
		website: `tb12.com`,
	},
]);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2">Recent Followers</h3>
		<div>
			<p v-if="followers.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no one is following you yet </span>
			</p>
			<HorizontalProfilePreview v-for="profile in followers" :key="profile.id" :profile="profile" />
			<button class="text-primary text-sm mt-2" @click="openFollowersPopup = true">Show more</button>
		</div>
	</div>
	<Teleport to="body">
		<FollowersPopup v-if="openFollowersPopup" @close="openFollowersPopup = false" />
	</Teleport>
</template>
