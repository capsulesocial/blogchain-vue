<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import { formatDate } from '@/helpers/helpers';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useProfilesStore } from '@/store/profiles';
import { getRegularPost } from '@/backend/post';

const props = withDefaults(
	defineProps<{
		authorid: string;
		timestamp: number;
		cid: string;
	}>(),
	{},
);
const profileStore = useProfilesStore();
const profile = computed(() => profileStore.getProfile(props.authorid));
const content = ref<string | undefined>();
onBeforeMount(() => profileStore.fetchProfile(props.authorid));
onMounted(async () => {
	const c = await getRegularPost(props.cid);
	console.log(c);
	content.value = c.data.content;
});
</script>

<template>
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
	<div
		v-if="content"
		class="my-4 pb-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
	>
		{{ content }}
	</div>
	<div
		v-else
		class="my-4 pb-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
	>
		<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse"></div>
	</div>
</template>
