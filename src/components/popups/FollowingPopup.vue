<script setup lang="ts">
import { computed } from 'vue';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

import { useProfilesStore } from '@/store/profiles';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';

const profilesStore = useProfilesStore();
const connections = useConnectionsStore();
const route = useRoute();
const router = useRouter();
const store = useStore();
const emit = defineEmits([`close`]);

if (route.name !== `Home`) {
	if (typeof route.params.id !== 'string') {
		throw new Error('Invalid param type for id');
	}
}

const authorID = computed(() => {
	if (route.name === `Home`) {
		return store.$state.id;
	}
	if (typeof route.params.id !== `string`) {
		throw new Error('route.params.id should not be an array!');
	}
	return route.params.id;
});
const profile = computed(() => profilesStore.getProfile(authorID.value));
// TODO: fetch following from store / backend
const followingList = computed(() => connections.getConnections(authorID.value)?.following);

function toggleDiscover() {
	router.push(`/discover`);
}
</script>
<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="followingList"
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2
						v-if="$route.name === `Home` || authorID === store.$state.id"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold"
					>
						Accounts you follow
					</h2>
					<h2
						v-else-if="profile.name !== ``"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold"
					>
						{{ profile.name }} is following
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						{{ profile.id }} is following
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="followingList.size == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="$route.name === `Home` || authorID === store.$state.id">
							It seems you aren't following anyone yet!
						</span>
						<span v-else-if="profile.name !== ``"> It looks like {{ profile.name }} isn't following anyone yet! </span>
						<span v-else> It seems that {{ profile.id }} isn't following anyone yet! </span>
					</p>
					<SecondaryButton
						v-if="store.$state.id === route.params.id || route.name === `Home`"
						:text="`Discover new content`"
						:action="toggleDiscover"
					/>
				</article>
				<article>
					<HorizontalProfilePreview v-for="follower in followingList" :id="follower" :key="follower" />
				</article>
			</div>
		</section>
	</div>
</template>
