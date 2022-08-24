<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store/session';
import { useProfilesStore } from '@/store/profiles';
import { useRoute } from 'vue-router';

import PinIcon from '@/components/icons/PinIcon.vue';
import LinkIcon from '@/components/icons/LinkIcon.vue';
import MailIcon from '@/components/icons/MailIcon.vue';

const store = useStore();
const route = useRoute();
const profilesStore = useProfilesStore();

const profile = computed(() => profilesStore.getProfile(route.params.id as string));

profilesStore.fetchProfile(route.params.id as string);

function redirectWebsite(): void {
	if (profile.value.website?.substr(0, 7) !== `http://` && profile.value.website?.substr(0, 8) !== `https://`) {
		window.open(`https://` + profile.value.website, `_blank`, `noopener,noreferrer`);
		window.opener = null;
		return;
	}
	window.open(profile.value.website, `_blank`, `noopener,noreferrer`);
	window.opener = null;
}
</script>

<template>
	<article
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 w-full rounded-lg border p-6 pt-4 pb-5 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-2 font-semibold">About</h6>
		<div v-if="profile.location === `` && profile.email === `` && profile.website === ``">
			<p class="text-gray5 dark:text-gray3 text-sm">
				<span v-if="store.$state.id === profile.id"> Display more information here by editing your profile! </span>
				<span v-else> {{ profile.id }} hasn't updated their bio yet</span>
			</p>
		</div>
		<div v-else>
			<div v-if="profile.location !== ``" class="flex flex-row items-center dark:text-darkPrimaryText">
				<PinIcon class="text-primary mr-3 h-4 w-4" /> {{ profile.location }}
			</div>
			<div v-if="profile.website !== `` && profile.location !== ``" class="mb-2"></div>
			<button
				v-if="profile.website !== ``"
				class="flex flex-row items-center text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary transition duration-500 ease-in-out"
				@click="redirectWebsite"
			>
				<LinkIcon class="text-primary mr-3 h-4 w-4 flex-shrink-0" />
				<p class="text-left" target="_blank" rel="noopener noreferrer" @click="redirectWebsite">
					{{ profile.website }}
				</p>
			</button>
			<div v-if="profile.email !== `` && (profile.location !== `` || profile.website !== ``)" class="mb-2"></div>
			<a
				v-if="profile.email !== ``"
				class="flex flex-row items-center text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary transition duration-500 ease-in-out"
				:href="`mailto:` + profile.email"
				target="_blank"
			>
				<MailIcon class="text-primary mr-3 h-4 w-4" />
				<p>{{ profile.email }}</p>
			</a>
		</div>
	</article>
</template>
