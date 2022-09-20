<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProfilesStore } from '@/store/profiles';
import { useRoute } from 'vue-router';
import { useStore } from '@/store/session';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';

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
// TODO: fetch following from store / backend
const mutualFollowers = ref<string[]>([`nairobi`, `john`]);
</script>
<template>
	<div class="popup">
		<!-- Container -->
		<section
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="emit(`close`)"
		>
			<div
				v-if="profile !== null"
				class="min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<h2 v-if="profile.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						Mutual Followers with {{ profile.name }}
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						Mutual Followers with {{ profile.id }}
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article v-if="mutualFollowers.length == 0" class="mt-24 grid justify-items-center px-10 xl:px-0">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center text-sm">
						<span v-if="profile.name !== ``">
							It seems you don't have any mutual followers with {{ profile.name }}
						</span>
						<span v-else> It seems you don't have any mutual followers with {{ profile.id }} </span>
					</p>
					<SecondaryButton
						:text="`Follow more people`"
						:action="
							() => {
								$router.push(`/discover`);
							}
						"
					/>
				</article>
				<article>
					<HorizontalProfilePreview v-for="follower in mutualFollowers" :id="follower" :key="follower" />
				</article>
			</div>
		</section>
	</div>
</template>
