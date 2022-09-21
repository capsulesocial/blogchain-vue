<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useStore } from '@/store/session';
import MutualsFollowersPopup from '../popups/MutualsFollowersPopup.vue';
import { useConnectionsStore } from '@/store/connections';
import { useRoute } from 'vue-router';

const store = useStore();
const connections = useConnectionsStore();
const route = useRoute();

const openMutualFollowersPopup = ref<boolean>(false);
const mutuals = ref<Set<string> | undefined>();
const authorID = route.params.id as string;

function getText(): string {
	if (!mutuals.value) {
		return ``;
	}
	const len = mutuals.value?.size;
	if (!mutuals.value) {
		return ``;
	}
	const [first] = mutuals.value;
	const [, second] = mutuals.value;
	switch (len) {
		case 0:
			return `No mutual followers`;
		case 1:
			return `Followed by ` + first;
		case 2:
			return `Followed by ` + first + ` and ` + second;
		case 3:
			return `Followed by ` + first + `, ` + second + `, and ` + [...mutuals.value][2];
		default:
			return (
				`Followed by ` +
				first +
				`, ` +
				second +
				`, ` +
				[...mutuals.value][2] +
				`, and ` +
				(len - 3) +
				` others you follow`
			);
	}
}

onBeforeMount(async () => {
	const myC = await connections.fetchConnections(store.id);
	const theirC = await connections.fetchConnections(authorID);
	if (myC && theirC) {
		mutuals.value = new Set([...theirC.followers].filter((p) => myC.followers.has(p)));
	}
});
</script>

<template>
	<article
		v-if="mutuals && mutuals.size > 0 && $route.params.id !== store.$state.id"
		class="mb-5 w-full rounded-lg bg-lightBG dark:bg-darkBGStop border-lightBorder px-6 py-4 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-2 font-semibold">Mutual Followers</h6>
		<div>
			<!-- Profile photos -->
			<div class="flex flex-row flex-wrap pl-4">
				<!-- <Avatar
					v-for="f in mutuals"
					:key="f.id"
					:author-id="f.id"
					:avatar="f.avatar"
					:size="`w-10 h-10`"
					class="-ml-4 rounded-xl bg-white dark:bg-transparent p-1"
				/> -->
				<div v-for="f in mutuals" :key="f" class="w-12 h-12 -ml-4 rounded-xl bg-white dark:bg-transparent p-1">
					<div class="bg-gray1 w-full h-full rounded-lg"></div>
				</div>
			</div>
			<!-- Names -->
			<div v-if="mutuals">
				<p class="text-gray5 dark:text-gray3 mb-4 mt-1 text-sm">
					{{ getText() }}
				</p>
			</div>
		</div>
		<button class="text-primary text-sm" @click="openMutualFollowersPopup = true">Show more</button>
	</article>
	<Teleport to="body">
		<MutualsFollowersPopup v-if="openMutualFollowersPopup" @close="openMutualFollowersPopup = false" />
	</Teleport>
</template>
