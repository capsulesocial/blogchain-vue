<script setup lang="ts">
import { ref } from 'vue';
import { useConnectionsStore } from '@/store/connections';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import FollowersPopup from '@/components/popups/FollowersPopup.vue';
import { storeToRefs } from 'pinia';

const connectionsStore = useConnectionsStore();
const { followersList } = storeToRefs(connectionsStore);

const openFollowersPopup = ref<boolean>(false);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2">Recent Followers</h3>
		<div>
			<p v-if="followersList.length === 0" class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
				<span> It seems no one is following you yet </span>
			</p>
			<div v-else>
				<HorizontalProfilePreview v-for="follower in followersList" :id="follower" :key="follower" />
				<button class="text-primary text-sm mt-2" @click="openFollowersPopup = true">Show more</button>
			</div>
		</div>
	</div>
	<Teleport to="body">
		<FollowersPopup v-if="openFollowersPopup" @close="openFollowersPopup = false" />
	</Teleport>
</template>
