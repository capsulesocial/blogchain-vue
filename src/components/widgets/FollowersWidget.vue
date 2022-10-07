<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useConnectionsStore } from '@/store/connections';
import { useStore } from '@/store/session';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import FollowersPopup from '@/components/popups/FollowersPopup.vue';

const store = useStore();
const route = useRoute();
const connections = useConnectionsStore();
const authorID = computed(() => {
	if (route.name === `Home`) {
		return store.$state.id;
	}
	if (typeof route.params.id !== `string`) {
		throw new Error('route.params.id should not be an array!');
	}
	return route.params.id;
});
const followersList = computed(() => connections.getConnections(authorID.value)?.followers);
const openFollowersPopup = ref<boolean>(false);
</script>
<template>
	<div class="bg-lightBG dark:bg-darkBGStop mb-5 rounded-lg border border-lightBorder shadow-lg px-6 py-4">
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2">Recent Followers</h3>
		<div v-if="followersList">
			<p v-if="followersList.size === 0" class="text-gray5 dark:text-gray3 mb-1 mt-3 text-sm">
				<span> It seems no one is following {{ authorID === store.id ? `you` : authorID }} yet </span>
			</p>
			<div v-else>
				<HorizontalProfilePreview v-for="follower in [...followersList].slice(0, 2)" :id="follower" :key="follower" />
				<button v-if="followersList.size > 2" class="text-primary text-sm mt-2" @click="openFollowersPopup = true">
					Show more
				</button>
			</div>
		</div>
	</div>
	<Teleport to="body">
		<FollowersPopup v-if="openFollowersPopup" @close="openFollowersPopup = false" />
	</Teleport>
</template>
