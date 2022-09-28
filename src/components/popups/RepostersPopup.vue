<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getReposters, IGetRepostsOptions } from '@/backend/reposts';
import HorizontalProfilePreview from '@/components/HorizontalProfilePreview.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import { Profile } from '@/backend/profile';
import { toastError } from '@/plugins/toast';
import { Algorithm } from '@/backend/post';
import { useProfilesStore } from '@/store/profiles';

const emit = defineEmits([`close`]);
const profileStore = useProfilesStore();

const props = withDefaults(
	defineProps<{
		cid: string;
	}>(),
	{},
);

const isLoading = ref<boolean>(true);
const reposters = ref<Array<string>>([]);
const repostersProfiles = ref<Array<Profile>>([]);

async function getFollowers(p: string) {
	await profileStore.fetchProfile(p);
	const profile = profileStore.getProfile(p);
	repostersProfiles.value.push(profile);
}

async function initReposters() {
	const options: IGetRepostsOptions = { sort: Algorithm.NEW, offset: 0, limit: 1000 };
	try {
		reposters.value = await getReposters(props.cid, options);
		reposters.value.forEach(await getFollowers);
	} catch (err) {
		toastError(err as string);
	} finally {
		isLoading.value = false;
	}
}

onMounted(async (): Promise<void> => {
	await initReposters();
});
</script>
<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<div
			v-if="props.cid !== null"
			class="popup min-h-40 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
		>
			<div class="sticky flex items-center justify-between mb-6">
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">Reposted this post</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</div>
			<article v-if="!isLoading && repostersProfiles.length > 0">
				<HorizontalProfilePreview v-for="reposter in repostersProfiles" :id="reposter.id" :key="reposter.id" />
			</article>
		</div>
	</div>
</template>
