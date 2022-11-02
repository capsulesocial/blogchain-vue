<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

import { useProfilesStore } from '@/store/profiles';
import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';

const profilesStore = useProfilesStore();
const route = useRoute();
const router = useRouter();
const store = useStore();
const emit = defineEmits([`close`]);
const connections = useConnectionsStore();

const authorID = computed(() => {
	if (route.name === 'Home') {
		return store.$state.id;
	}

	if (typeof route.params.id !== 'string') {
		throw new Error('route.params.id should not be an array!');
	}

	return route.params.id;
});
profilesStore.fetchProfile(authorID.value);

const profile = computed(() => profilesStore.getProfile(authorID.value));
const followersList = computed(() => connections.getConnections(authorID.value)?.followers);

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
				v-if="followersList"
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
				@click.self="emit(`close`)"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2
						v-if="$route.name === `Home` || authorID === store.$state.id"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold"
					>
						Your followers
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						{{ profile.name !== `` ? profile.name : profile.id }}'s followers
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="followersList.size == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="$route.name === `home` || authorID === store.$state.id">
							It seems you don't have any followers yet!
						</span>
						<span v-else>
							It looks like {{ profile.name !== `` ? profile.name : profile.id }}
							doesn't have any followers yet!
						</span>
					</p>
					<SecondaryButton
						v-if="store.$state.id === route.params.id || route.name === `Home`"
						:text="`Discover new content`"
						:action="toggleDiscover"
					/>
				</article>
				<article>
					<HorizontalProfilePreview v-for="follower in followersList" :id="follower" :key="follower" />
				</article>
			</div>
		</section>
	</div>
</template>
