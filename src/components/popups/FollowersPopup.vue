<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Profile } from '@/backend/profile';
import { useProfilesStore } from '@/store/profiles';
import { useRoute } from 'vue-router';
import { useStore } from '@/store/session';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const profilesStore = useProfilesStore();
const route = useRoute();
const store = useStore();
const emit = defineEmits([`close`]);

if (route.name !== `Home`) {
	if (typeof route.params.id !== 'string') {
		throw new Error('Invalid param type for id');
	}
}

const authorID = route.name === `Home` ? store.$state.id : route.params.id;
const profile = computed(() => profilesStore.getProfile(authorID as string));
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
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="followers !== null"
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
				@click.self="emit(`close`)"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2
						v-if="$route.name === `Home` || $route.params.id === store.$state.id"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold"
					>
						Your followers
					</h2>
					<h2
						v-else-if="profile.name !== ``"
						class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold"
					>
						{{ profile.name }}'s followers
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						{{ profile.id }}'s followers
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="followers.length == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="$route.name === `home` || $route.params.id === store.$state.id">
							It seems you don't have any followers yet!
						</span>
						<span v-else-if="profile.name !== ``">
							It looks like {{ profile.name }} doesn't have any followers yet!
						</span>
						<span v-else> It seems that {{ profile.id }} doesn't have any followers yet! </span>
					</p>
					<SecondaryButton
						v-if="$route.name === `home` || store.$state.id === $route.params.id"
						:text="`Discover new content`"
					/>
				</article>
				<article>
					<HorizontalProfilePreview v-for="follower in followers" :key="follower.id" :profile="follower" />
				</article>
			</div>
		</section>
	</div>
</template>
