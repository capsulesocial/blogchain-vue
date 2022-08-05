<script setup lang="ts">
import type { PropType } from 'vue'
import type { Profile } from '@/backend/profile'
// import { ref } from 'vue'
import { useSessionStore } from '../store/session'
// import Avatar from './Avatar.vue'

const store = useSessionStore()
// const userIsFollowed = ref<boolean>(false)
// const visitAvatar = ref<string | ArrayBuffer>(``)

defineProps({
	profile: {
		type: Object as PropType<Profile>,
		required: true,
	},
})

// function toggleFriend() {
// 	return
// }
</script>

<template>
	<div v-if="profile !== null" class="flex items-center py-2">
		<!-- TODO import Avatar component -->
		<!-- <Avatar :author-i-d="profile.id" :avatar="visitAvatar" size="w-12 h-12" /> -->
		<div class="w-12 h-12 rounded-lg bg-gray1 animate-pulse"></div>
		<div class="h-12 flex-grow px-4">
			<router-link :to="`/id/` + profile.id" class="flex flex-col">
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
