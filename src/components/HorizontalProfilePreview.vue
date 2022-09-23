<script setup lang="ts">
// import { ref } from 'vue'
import { useStore } from '../store/session';
import { useProfilesStore } from '@/store/profiles';
import { computed, onMounted } from 'vue';
import Avatar from '@/components/Avatar.vue';

const store = useStore();
// const userIsFollowed = ref<boolean>(false)
// const visitAvatar = ref<string | ArrayBuffer>(``)
const props = withDefaults(
	defineProps<{
		id: string;
	}>(),
	{},
);

const profile = computed(() => useProfilesStore().getProfile(props.id));

onMounted(() => {
	void useProfilesStore().fetchProfile(props.id);
});

// function toggleFriend() {
// 	return
// }
</script>

<template>
	<div v-if="profile !== null" class="flex items-center py-2">
		<Avatar :authorid="props.id" :avatar="profile.avatar" size="w-12 h-12" />
		<!-- <div class="w-12 h-12 rounded-lg bg-gray1 animate-pulse"></div> -->
		<div class="h-12 flex-grow px-4">
			<router-link :to="`/id/` + props.id" class="flex flex-col">
				<span v-if="profile.name != ``" class="text-base font-medium dark:text-darkPrimaryText">
					{{ profile.name }}
				</span>
				<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ profile.id }} </span>
				<span class="text-gray5 dark:text-gray3 text-sm">@{{ profile.id }}</span>
			</router-link>
		</div>
		<!-- TODO import FollowButton component -->
		<!-- <FriendButton
			v-if="profile.id !== store.$state.id"
			:toggle-friend="toggleFriend"
			:user-is-followed="userIsFollowed"
			class="justify-self-end"
		/> -->
		<div v-if="profile.id !== store.$state.id" class="w-24 h-8 rounded-lg bg-gray1 animate-pulse"></div>
		<span
			v-else
			class="bg-gray1 dark:bg-lightBG dark:text-darkPrimaryText rounded-2xl dark:bg-opacity-25 py-1 px-2 text-xs"
		>
			You
		</span>
	</div>
</template>
