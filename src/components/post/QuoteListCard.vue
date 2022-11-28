<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import { formatDate } from '@/helpers/helpers';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import { useProfilesStore } from '@/store/profiles';
import { getRegularPost } from '@/backend/post';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { usePostsStore } from '@/store/posts';
import { handleError } from '@/plugins/toast';

const props = withDefaults(
	defineProps<{
		authorid: string;
		timestamp: number;
		cid: string;
	}>(),
	{},
);

const emit = defineEmits([`hide`]);

const store = useStore();
const profileStore = useProfilesStore();
const postsStore = usePostsStore();
const settings = useStoreSettings();
const profile = computed(() => profileStore.getProfile(props.authorid));
const content = ref<string | undefined>();
const showDelete = ref(false);

function openDeleteDropdown() {
	showDelete.value = true;
	window.addEventListener(`click`, (e) => {
		showDelete.value = false;
	});
}
async function deleteRepost() {
	try {
		await postsStore.removePost(props.cid, store.$state.id);
	} catch (err) {
		handleError(err);
	} finally {
		emit(`hide`);
	}
}

onBeforeMount(() => profileStore.fetchProfile(props.authorid));

onMounted(async () => {
	const c = await getRegularPost(props.cid);
	content.value = c.data.content;
});
</script>

<template>
	<div class="flex justify-between">
		<!-- Left side: avatar, name -->
		<div class="flex items-center">
			<Avatar :authorid="props.authorid" :cid="profile.avatar" size="w-12 h-12" />
			<div class="h-12 flex flex-col px-4">
				<router-link :to="`/id/` + props.authorid" class="flex items-center">
					<span v-if="profile.name != ``" class="text-base font-medium text-lightPrimaryText dark:text-darkPrimaryText">
						{{ profile.name }}
					</span>
					<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ props.authorid }} </span>
					<span class="text-gray5 dark:text-gray3 text-sm ml-2">@{{ props.authorid }}</span>
				</router-link>
				<span class="mt-1 text-xs text-gray5 dark:text-gray3">{{ formatDate(props.timestamp) }}</span>
			</div>
		</div>
		<!-- Right side: delete dropdown -->
		<div class="relative">
			<button
				v-if="props.authorid === store.$state.id"
				class="focus:outline-none text-gray5 dark:text-gray3 ml-2"
				@click.stop="openDeleteDropdown"
			>
				<MoreIcon />
			</button>
			<div
				v-if="showDelete"
				class="dropdownDeleteOpen border-lightBorder modal-animation absolute z-10 right-0 flex w-36 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
				:class="settings.isDarkMode ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
				:style="`margin-right: -10px;`"
			>
				<!-- Delete -->
				<button class="focus:outline-none text-negative flex items-center" @click="deleteRepost">
					<BinIcon class="m-1 w-4 h-4" />
					<span class="text-negative self-center text-xs text-center w-full">Remove from feed</span>
				</button>
			</div>
		</div>
	</div>
	<div v-if="content" class="py-4 text-lightPrimaryText dark:text-darkPrimaryText">
		{{ content }}
	</div>
	<div v-else class="py-4 text-lightPrimaryText dark:text-darkPrimaryText">
		<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse"></div>
	</div>
</template>
