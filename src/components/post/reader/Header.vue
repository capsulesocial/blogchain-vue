<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStore } from '@/store/session';
import { useProfilesStore } from '@/store/profiles';
import { useRouter } from 'vue-router';

import Avatar from '@/components/Avatar.vue';
import FriendButton from '@/components/FriendButton.vue';
import XIcon from '@/components/icons/CloseIcon.vue';
import TimestampAndReadingTime from '@/components/TimestampAndReadingTime.vue';

const store = useStore();
const profilesStore = useProfilesStore();
const router = useRouter();

const props = withDefaults(
	defineProps<{
		id: string;
		timestamp: number;
		wordCount?: number;
		postimages?: number;
	}>(),
	{
		postimages: 0,
		wordCount: 0,
	},
);

const profile = computed(() => profilesStore.getProfile(props.id));

onMounted(async () => {
	profilesStore.fetchProfile(props.id);
});

const handleClose = () => {
	router.go(-1);
};
</script>
<template>
	<header
		id="header"
		class="page-header xl:w-760 xl:max-w-760 bg-lightBG dark:bg-darkBG border-b border-r border-l border-lightBorder shadow-sm sticky top-0 z-10 flex w-full items-center rounded-b-lg py-2 px-5"
	>
		<div class="trigger-menu-wrapper flex w-full justify-center py-2 ease-in-out">
			<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
				<!-- Left side: name, avatar, date -->
				<div class="flex items-center">
					<Avatar :cid="profile.avatar" :authorid="props.id" size="w-10 h-10" class="mr-4 flex-shrink-0" />
					<div class="pr-8 flex flex-col">
						<router-link
							v-if="profile && profile.name !== ``"
							:to="`/id/` + props.id"
							class="font-semibold dark:text-darkPrimaryText"
							>{{ profile.name }}</router-link
						>
						<router-link v-else :to="`/id/` + props.id" class="text-gray5 dark:text-gray3 font-semibold">{{
							props.id
						}}</router-link>
						<router-link :to="`/id/` + props.id" class="text-gray5 dark:text-gray3 text-xs">
							@{{ props.id }}</router-link
						>
					</div>
					<FriendButton v-if="props.id !== store.$state.id" :authorid="props.id" class="hidden lg:block" />
					<TimestampAndReadingTime
						class="flex flex-col lg:flex-row items-center lg:ml-8"
						:timestamp="props.timestamp"
						:number-of-post-images="props.postimages"
						:word-count="props.wordCount"
					/>
				</div>
				<span class="flex items-center">
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="handleClose">
						<XIcon />
					</button>
				</span>
			</div>
		</div>
	</header>
</template>
