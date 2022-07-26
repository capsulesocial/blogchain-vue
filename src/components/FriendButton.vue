<script setup lang="ts">
import FriendAddIcon from '@/components/icons/FriendAdd.vue';
import FriendRemoveIcon from '@/components/icons/FriendRemove.vue';

import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';
import { useRootStore } from '@/store/index';

import { computed } from 'vue';

const props = defineProps<{
	authorid: string;
}>();

const store = useStore();
const connectionsStore = useConnectionsStore();
const rootStore = useRootStore();

const isFollowing = computed(() => connectionsStore.getFollowStatus(store.id, props.authorid));

function handleFollowUnfollow() {
	if (store.$state.id === ``) {
		rootStore.toggleUnauthPopup(true);
		return;
	}
	connectionsStore.toggleFollowing(props.authorid);
}
</script>

<template>
	<button class="focus:outline-none block rounded-lg" @click="handleFollowUnfollow()">
		<div v-if="isFollowing">
			<!-- Desktop -->
			<div
				class="friendbtn text-grey5 hidden rounded-lg bg-lightBG px-5 text-sm font-semibold shadow-sm border border-lightBorder transition duration-300 ease-in-out hover:text-negative hover:border-negative xl:block"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
			>
				<span class="following">Following</span>

				<span class="unfollow" style="padding-right: 0.15rem; padding-left: 0.15rem">Unfollow</span>
			</div>
			<!-- Mobile -->
			<div
				class="friendbtn dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText rounded-lg p-1 shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
			>
				<FriendRemoveIcon class="m-1 h-5 w-5" />
			</div>
		</div>
		<div v-else>
			<!-- Desktop -->
			<span
				class="bg-darkBG hover:bg-opacity-75 hidden rounded-lg px-5 text-sm font-semibold text-lightOnPrimaryText shadow-sm border border-lightBorder dark:border-gray7 transition duration-300 ease-in-out xl:block"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				>Follow</span
			>
			<!-- Mobile -->
			<div
				class="bg-darkBG rounded-lg p-1 text-lightOnPrimaryText shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
			>
				<FriendAddIcon class="m-1 h-5 w-5" />
			</div>
		</div>
	</button>
</template>

<style scoped>
div.friendbtn span.following {
	display: block;
}
div.friendbtn:hover span.following {
	display: none;
}
div.friendbtn span.unfollow {
	display: none;
}
div.friendbtn:hover span.unfollow {
	display: block;
}
</style>
