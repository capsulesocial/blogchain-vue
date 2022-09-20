<script setup lang="ts">
import { ref, watch } from 'vue';
import { Profile } from '@/backend/profile';
import { useProfilesStore } from '@/store/profiles';
import { useConnectionsStore } from '@/store/connections';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import FollowersPopup from '@/components/popups/FollowersPopup.vue';

const connections = useConnectionsStore();
const profiles = useProfilesStore();
const recentFollowers = ref<Profile[]>([]);

watch(connections, (cons) => {
	recentFollowers.value = [];
	cons.followers.forEach((p) => {
		const profile = profiles.getProfile(p);
		recentFollowers.value.push(profile);
	});
});

const openFollowersPopup = ref<boolean>(false);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2">Recent Followers</h3>
		<div>
			<p v-if="recentFollowers.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no one is following you yet </span>
			</p>
			<div v-else>
				<HorizontalProfilePreview v-for="profile in recentFollowers" :key="profile.id" :profile="profile" />
				<button class="text-primary text-sm mt-2" @click="openFollowersPopup = true">Show more</button>
			</div>
		</div>
	</div>
	<Teleport to="body">
		<FollowersPopup v-if="openFollowersPopup" @close="openFollowersPopup = false" />
	</Teleport>
</template>
