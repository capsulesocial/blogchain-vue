<script setup lang="ts">
import { Tag } from '@/backend/post';
import { computed, ref } from 'vue';
import XIcon from '@/components/icons/XIcon.vue';
import { useDraftStore } from '@/store/drafts';
import { qualityTags } from '@/plugins/quality';
import { toastError } from '@/plugins/toast';
import { isError } from '@/plugins/helpers';

const draftStore = useDraftStore();
const tag = ref<string>(``);
const tags = computed(() => draftStore.getDraftTags);

function addTag() {
	const quality: { error: string } | { success: boolean } = qualityTags(tag.value, draftStore.getDraftTags);
	if (isError(quality)) {
		toastError(quality.error);
		return;
	}
	draftStore.addTag(tag.value);
	tag.value = ``;
}

function removeTag(tag: Tag) {
	draftStore.removeTag(tag);
}
</script>
<template>
	<article class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border px-6 py-4 pb-6 shadow-lg">
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Tags</h6>
		<div
			class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 my-1 w-full rounded-lg p-2"
		>
			<label for="tag" class="hidden" value="Enter hashtags"></label>
			<input
				v-model="tag"
				type="text"
				placeholder="Add a tag..."
				class="focus:outline-none bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 placeholder-gray5 dark:placeholder-gray3 w-full"
				@keyup.enter="addTag"
			/>
		</div>
		<div class="flex flex-row flex-wrap">
			<button
				v-for="t in tags"
				:key="t.name"
				class="focus:outline-none bg-gray1 dark:bg-gray7 mr-4 mt-2 flex flex-row items-center rounded-lg px-3 py-1"
				@click="removeTag(t)"
			>
				<span class="text-gray5 dark:text-gray1 text-sm font-semibold">{{ t.name }}</span
				><XIcon class="text-gray5 dark:text-gray1 p-1 pr-0" />
			</button>
		</div>
	</article>
</template>
