<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import type { Profile } from '@/backend/profile';
import { formatDate } from '@/helpers/helpers';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';

const settings = useStoreSettings();
const store = useStore();

const content = ref<string>(`this is a default reply`);
const replyAuthor = ref<Profile>({
	id: `jackistesting`,
	name: `Jack Dishman`,
	email: `tb12@gmail.com`,
	bio: `6-time super bowl champion`,
	location: `Tampa Bay`,
	avatar: ``,
	socials: [],
	website: `tb12.com`,
});
const postAuthor = ref<string>(`jackistesting`);
const timestamp = ref<number>(13392);

const replyDeleted = ref<boolean>(false);
const showDelete = ref<boolean>(false);

function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}
</script>
<template>
	<div v-if="!replyDeleted" class="flex relative">
		<div class="flex-shrink-0 mr-2">
			<!-- <Avatar :avatar="avatar" :authorID="authorID" size="w-10 h-10" /> -->
			<div class="w-10 h-10 rounded-lg bg-gray1 animate-pulse"></div>
		</div>
		<div class="ml-2 flex-1 leading-relaxed">
			<div class="flex flex-col sm:flex-row items-start sm:items-center">
				<strong
					v-if="replyAuthor.name !== ``"
					class="bold mr-2 font-semibold text-lightPrimaryText dark:text-darkPrimaryText"
				>
					{{ replyAuthor.name }}
				</strong>
				<strong v-else class="bold mr-2 font-semibold text-gray5 dark:text-gray3">
					{{ replyAuthor.id }}
				</strong>
				<router-link :to="`/id/` + replyAuthor.id" class="mr-3 text-sm text-gray5 dark:text-gray3">
					@{{ replyAuthor.id }}
				</router-link>
				<div class="h-1 w-1 bg-gray5 mr-2 rounded-xl"></div>
				<span v-if="timestamp" class="text-xs text-gray5 dark:text-gray3">
					{{ formatDate(timestamp) }}
				</span>
				<!-- Three dots dropdown -->
				<button
					v-if="store.$state.id === replyAuthor.id || store.$state.id === postAuthor"
					class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-2 pr-3"
					@click.stop="toggleDropdownDelete"
				>
					<MoreIcon />
				</button>
				<div
					v-show="showDelete"
					class="border-lightBorder modal-animation absolute z-10 flex w-40 flex-col items-center rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
					:class="settings.isDarkMode ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
					style="top: 40px; right: 0px"
				>
					<!-- Delete -->
					<button class="focus:outline-none text-negative flex">
						<BinIcon class="w-4 h-4" />
						<span class="text-negative self-center text-xs ml-1 mr-1">Remove this reply</span>
					</button>
				</div>
			</div>
			<p
				class="leading-relaxed w-full py-1 text-sm text-lightPrimaryText dark:text-darkSecondaryText"
				style="word-break: break-word"
			>
				<span style="white-space: pre-line">{{ content }}</span>
			</p>
		</div>
	</div>
</template>
<style>
.dropdownDeleteOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.8rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownDeleteOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.8rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>
