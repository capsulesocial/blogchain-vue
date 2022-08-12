<script setup lang="ts">
import { useStore } from '@/store/session';

import PinIcon from '@/components/icons/PinIcon.vue';
import LinkIcon from '@/components/icons/LinkIcon.vue';
import MailIcon from '@/components/icons/MailIcon.vue';

const store = useStore();

function redirectWebsite(): void {
	if (store.$state.website.substr(0, 7) !== `http://` && store.$state.website.substr(0, 8) !== `https://`) {
		window.open(`https://` + store.$state.website, `_blank`, `noopener,noreferrer`);
		window.opener = null;
		return;
	}
	window.open(store.$state.website, `_blank`, `noopener,noreferrer`);
	window.opener = null;
}
</script>

<template>
	<article
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 w-full rounded-lg border p-6 pt-4 pb-5 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-2 font-semibold">About</h6>
		<div v-if="store.$state.location === `` && store.$state.email === `` && store.$state.website === ``">
			<p class="text-gray5 dark:text-gray3 text-sm">
				<span v-if="$route.params.id === store.$state.id">
					Display more information here by editing your profile!
				</span>
				<span v-else> {{ $route.params.id }} hasn't updated their bio yet</span>
			</p>
		</div>
		<div v-else>
			<div v-if="store.$state.location !== ``" class="flex flex-row items-center dark:text-darkPrimaryText">
				<PinIcon class="text-primary mr-3 h-4 w-4" /> {{ store.$state.location }}
			</div>
			<div v-if="store.$state.website !== `` && store.$state.location !== ``" class="mb-2"></div>
			<button
				v-if="store.$state.website !== ``"
				class="flex flex-row items-center text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary transition duration-500 ease-in-out"
				@click="redirectWebsite"
			>
				<LinkIcon class="text-primary mr-3 h-4 w-4 flex-shrink-0" />
				<p class="text-left" target="_blank" rel="noopener noreferrer" @click="redirectWebsite">
					{{ store.$state.website }}
				</p>
			</button>
			<div
				v-if="store.$state.email !== `` && (store.$state.location !== `` || store.$state.website !== ``)"
				class="mb-2"
			></div>
			<a
				v-if="store.$state.email !== ``"
				class="flex flex-row items-center text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary transition duration-500 ease-in-out"
				:href="`mailto:` + store.$state.email"
				target="_blank"
			>
				<MailIcon class="text-primary mr-3 h-4 w-4" />
				<p>{{ store.$state.email }}</p>
			</a>
		</div>
	</article>
</template>
