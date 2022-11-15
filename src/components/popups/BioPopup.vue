<script setup lang="ts">
import { computed } from 'vue';
import { useProfilesStore } from '@/store/profiles';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const profilesStore = useProfilesStore();
const emit = defineEmits([`close`]);

const props = withDefaults(
	defineProps<{
		id: string;
	}>(),
	{},
);

const profile = computed(() => profilesStore.getProfile(props.id));
</script>
<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<div
			class="popup w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<div class="sticky flex items-center justify-between">
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
					{{ profile.name !== `` ? profile.name : `@${profile.id}` }}'s bio
				</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click.prevent="$emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<article>
				<div class="text-gray5 dark:text-gray3 mt-5 text-sm">
					<p v-for="(line, lineNumber) of profile.bio.split('\n')" :key="lineNumber">{{ line }}</p>
				</div>
			</article>
		</div>
	</div>
</template>
