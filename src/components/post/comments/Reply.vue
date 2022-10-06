<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { useProfilesStore } from '@/store/profiles';
import { formatDate } from '@/helpers/helpers';
import { useCommentsStore } from '@/store/comments';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import Avatar from '@/components/Avatar.vue';

const props = defineProps<{
	cid: string;
}>();

const settings = useStoreSettings();
const store = useStore();
const profileStore = useProfilesStore();
const commentStore = useCommentsStore();

const replyDeleted = ref<boolean>(false);
const showDelete = ref<boolean>(false);
const comment = computed(() => commentStore.getCommentData(props.cid));
const author = computed(() => {
	if (!comment.value) {
		return;
	}
	return profileStore.getProfile(comment.value.authorID);
});

function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}

watch(comment, (c) => {
	if (!c) {
		return;
	}
	profileStore.fetchProfile(c.authorID);
});

async function removeReply(): Promise<void> {
	showDelete.value = false;
	await commentStore.removeUserComment(props.cid, store.$state.id);
}

onMounted(() => {
	commentStore.fetchComment(props.cid);

	window.addEventListener(
		`click`,
		(e: any): void => {
			if (!e.target) {
				return;
			}
			if (
				e.target.parentNode === null ||
				e.target.parentNode.classList === undefined ||
				!e.target.parentNode.classList.contains(`toggleDelete`)
			) {
				showDelete.value = false;
			}
		},
		false,
	);
});
</script>
<template>
	<div v-if="!replyDeleted && author && comment" class="flex relative pt-1 mt-2">
		<div class="flex-shrink-0 mr-2">
			<Avatar :cid="author.avatar" :author-i-d="author.id" size="w-10 h-10" />
		</div>
		<div class="ml-2 flex-1 leading-relaxed">
			<div class="flex flex-col sm:flex-row items-start sm:items-center">
				<strong
					v-if="author.name !== ``"
					class="bold mr-2 font-semibold text-lightPrimaryText dark:text-darkPrimaryText"
				>
					{{ author.name }}
				</strong>
				<strong v-else class="bold mr-2 font-semibold text-gray5 dark:text-gray3">
					{{ author.id }}
				</strong>
				<router-link :to="`/id/` + author.id" class="mr-3 text-sm text-gray5 dark:text-gray3">
					@{{ author.id }}
				</router-link>
				<div class="h-1 w-1 bg-gray5 mr-2 rounded-xl"></div>
				<span v-if="comment.timestamp" class="text-xs text-gray5 dark:text-gray3">
					{{ formatDate(comment.timestamp) }}
				</span>
				<!-- Three dots dropdown -->
				<button
					v-if="store.$state.id === author.id || store.$state.id === author.id"
					class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-2 pr-3 toggleDelete"
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
					<button class="focus:outline-none text-negative flex" @click="removeReply()">
						<BinIcon class="w-4 h-4" />
						<span class="text-negative self-center text-xs ml-1 mr-1">Remove this reply</span>
					</button>
				</div>
			</div>
			<p
				class="leading-relaxed w-full py-1 text-sm text-lightPrimaryText dark:text-darkSecondaryText"
				style="word-break: break-word"
			>
				<span style="white-space: pre-line">{{ comment.content }}</span>
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
