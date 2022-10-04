<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RepostIcon from '@/components/icons/RepostIcon.vue';
import QuoteIcon from '@/components/icons/QuoteIcon.vue';
import { useStoreSettings } from '@/store/settings';
import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';
import { handleError } from '@/plugins/toast';

const props = defineProps<{
	repost?: string;
	postcid: string;
	repostCount: number;
}>();

const settings = useStoreSettings();
const connectionsStore = useConnectionsStore();
const store = useStore();

const isReposted = ref<boolean>(props.repost !== undefined);
const repostsCount = ref<number>(props.repostCount);
const repostCID = ref<string | undefined>(props.repost);
const repostDropdown = ref<boolean>(false);

async function toggleRepost() {
	// undo repost
	if (isReposted.value && repostCID.value) {
		try {
			await connectionsStore.removeSimpleRepost(repostCID.value, store.$state.id);
		} catch (err) {
			handleError(err);
		} finally {
			isReposted.value = false;
			repostCID.value = undefined;
			repostsCount.value -= 1;
			return;
		}
	}
	// send repost
	try {
		repostCID.value = await connectionsStore.sendSimpleRepost(store.$state.id, props.postcid, ``, `simple`);
	} catch (err) {
		handleError(err);
	} finally {
		isReposted.value = true;
		repostsCount.value += 1;
		return;
	}
}
function toggleQuoteRepost() {}

onMounted(() => {
	window.addEventListener(
		`click`,
		(e: any): void => {
			if (!e.target) {
				return;
			}
			if (
				e.target.parentNode === null ||
				e.target.parentNode.classList === undefined ||
				!e.target.parentNode.classList.contains(`toggleRepost`)
			) {
				repostDropdown.value = false;
			}
		},
		false,
	);
});
</script>

<template>
	<button
		class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary mr-4 flex toggleRepost items-center"
		:class="isReposted ? `text-primary` : ``"
		@click.stop="repostDropdown = !repostDropdown"
	>
		<RepostIcon class="w-5 h-5" />
		<span class="ml-1 text-sm">{{ repostsCount }}</span>
	</button>
	<div
		v-show="repostDropdown"
		class="bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder modal-animation absolute z-20 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
		:class="settings.isDarkMode ? `dropdownRepostOpenDark` : `dropdownRepostOpen`"
		style="left: 95px; bottom: -2px"
	>
		<!-- Simple Repost -->
		<button
			class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
			@click="toggleRepost"
		>
			<RepostIcon :shrink="true" class="mr-2 p-1" :class="isReposted ? `text-primary` : ``" />
			<span v-if="isReposted" class="self-center text-xs">Undo Repost</span>
			<span v-else class="self-center text-xs">Repost to Feed</span>
		</button>
		<!-- Quote Repost -->
		<button
			class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
			@click="toggleQuoteRepost"
		>
			<QuoteIcon class="mr-2 p-1" />
			<span class="self-center text-xs">Quote</span>
		</button>
	</div>
</template>
