<script setup lang="ts">
import { ref } from 'vue';
import type { Profile } from '@/backend/profile';

// TODO: fetch mutual followers from store / backend
const mutuals = ref<Profile[]>([
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

function getText(): string {
	const len = mutuals.value.length;
	switch (len) {
		case 0:
			return `No mutual followers`;
		case 1:
			return `Followed by ` + mutuals.value[0].id;
		case 2:
			return `Followed by ` + mutuals.value[0].id + ` and ` + mutuals.value[1].id;
		case 3:
			return `Followed by ` + mutuals.value[0].id + `, ` + mutuals.value[1].id + `, and ` + mutuals.value[2].id;
		default:
			return (
				`Followed by ` +
				mutuals.value[0].id +
				`, ` +
				mutuals.value[1].id +
				`, ` +
				mutuals.value[2].id +
				`, and ` +
				(len - 3) +
				` others you follow`
			);
	}
}
</script>

<template>
	<article
		v-if="mutuals.length > 0"
		class="mb-5 w-full rounded-lg bg-lightBG dark:bg-darkBGStop border-lightBorder px-6 py-4 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-2 font-semibold">Mutual Followers</h6>
		<div>
			<!-- Profile photos -->
			<div class="flex flex-row flex-wrap pl-4">
				<!-- <Avatar
					v-for="f in mutuals"
					:key="f.id"
					:author-id="f.id"
					:avatar="f.avatar"
					:size="`w-10 h-10`"
					class="-ml-4 rounded-xl bg-white dark:bg-transparent p-1"
				/> -->
				<div v-for="f in mutuals" :key="f.id" class="w-12 h-12 -ml-4 rounded-xl bg-white dark:bg-transparent p-1">
					<div class="bg-gray1 w-full h-full rounded-lg"></div>
				</div>
			</div>
			<!-- Names -->
			<div v-if="mutuals">
				<p class="text-gray5 dark:text-gray3 mb-4 mt-1 text-sm">
					{{ getText() }}
				</p>
			</div>
		</div>
		<button class="text-primary text-sm">Show more</button>
	</article>
</template>
