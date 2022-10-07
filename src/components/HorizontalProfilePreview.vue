<script setup lang="ts">
// import { ref } from 'vue'
import { useStore } from '../store/session';
import { useProfilesStore } from '@/store/profiles';
import { computed, onMounted } from 'vue';

import Avatar from '@/components/Avatar.vue';
import FriendButton from '@/components/FriendButton.vue';

const store = useStore();

const props = defineProps<{
	id: string;
}>();

const profile = computed(() => useProfilesStore().getProfile(props.id));

onMounted(() => {
	useProfilesStore().fetchProfile(props.id);
});
</script>

<template>
	<div v-if="profile !== null" class="flex items-center py-2">
		<Avatar :authorid="props.id" :cid="profile.avatar" size="w-12 h-12" />
		<div class="h-12 flex-grow px-4">
			<router-link :to="`/id/` + props.id" class="flex flex-col">
				<span v-if="profile.name != ``" class="text-base font-medium dark:text-darkPrimaryText">
					{{ profile.name }}
				</span>
				<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ profile.id }} </span>
				<span class="text-gray5 dark:text-gray3 text-sm">@{{ profile.id }}</span>
			</router-link>
		</div>
		<FriendButton v-if="profile.id !== store.$state.id" :authorid="profile.id" class="justify-self-end" />
		<span
			v-else
			class="bg-gray1 dark:bg-lightBG dark:text-darkPrimaryText rounded-2xl dark:bg-opacity-25 py-1 px-2 text-xs"
		>
			You
		</span>
	</div>
</template>
