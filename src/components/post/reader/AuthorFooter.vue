<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/store/session';
import { useProfilesStore } from '@/store/profiles';
import Avatar from '@/components/Avatar.vue';
import BioPopup from '@/components/popups/BioPopup.vue';
import FriendButton from '@/components/FriendButton.vue';

const store = useStore();
const profilesStore = useProfilesStore();

const props = withDefaults(
	defineProps<{
		id: string;
		isFollowed: boolean;
		toggleFriend: () => void;
	}>(),
	{},
);

const profile = computed(() => profilesStore.getProfile(props.id));
const longBio = ref<boolean>(profile.value.bio.length > 200);
const expandBio = ref<boolean>(false);

onMounted(async () => {
	void profilesStore.fetchProfile(props.id);
});
</script>

<template>
	<div class="mb-5 border-t border-b py-5 dark:border-gray7">
		<div class="flex flex-col items-center justify-between lg:flex-row">
			<div>
				<h6 class="text-gray5 dark:text-gray3 mb-4 font-sans text-sm">Written By:</h6>
				<div class="flex pr-5">
					<Avatar :cid="profile.avatar" :authorid="profile.id" size="w-16 h-16" class="flex-shrink-0 self-start" />
					<div class="mx-4">
						<router-link
							v-if="profile.name !== ``"
							:to="'/id/' + profile.id"
							class="text-2xl dark:text-darkPrimaryText"
						>
							{{ profile.name }}
						</router-link>
						<router-link v-else :to="'/id/' + profile.id" class="text-gray5 text-2xl"> {{ profile.id }} </router-link>
						<div v-show="profile.bio" id="bio" ref="bio" style="max-height: 6rem; overflow: hidden">
							<p class="text-gray5 dark:text-darkSecondaryText w-full">
								{{ profile.bio.slice(0, 180) + (profile.bio.length > 180 ? '...' : '') }}<br />
							</p>
						</div>
						<button v-if="longBio" class="focus:outline-none text-xs text-primary py-1" @click="expandBio = true">
							Read more
						</button>
					</div>
				</div>
			</div>
			<div class="mr-5 mt-3 xl:mt-0">
				<FriendButton
					v-if="props.id !== store.$state.id"
					class="hidden justify-self-end xl:block"
					:user-is-followed="isFollowed"
					:toggle-friend="toggleFriend"
				/>
			</div>
		</div>
		<Teleport to="body">
			<BioPopup v-if="expandBio" :id="props.id" @close="expandBio = false" />
		</Teleport>
	</div>
</template>
