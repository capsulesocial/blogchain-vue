<script setup lang="ts">
import { onBeforeUnmount, ref, onMounted } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { DraftPost } from '@/store/drafts';
import { formatDate } from '@/helpers/helpers';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import ImageIcon from '@/components/icons/ImageIcon.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import { useDraftStore } from '@/store/drafts';
import router from '@/router';

const emit = defineEmits([`closeDraftsPopup`, `save`]);

const props = defineProps<{
	draft: DraftPost;
}>();

const settings = useStoreSettings();
const draftStore = useDraftStore();
const featuredPhoto = ref<any>();
const inWidget = ref(true);
const delayActiveDraft = ref(false);
const showDelete = ref(false);

function setActiveDraft() {
	const i = draftStore.getDraftIndex(props.draft);
	// drafts popup on editor
	if (router.currentRoute.value.name === `Post Editor`) {
		emit(`save`);
		delayActiveDraft.value = true;
		emit(`closeDraftsPopup`);
		return;
	}
	// Prevent overwriting of selected draft
	if (settings.widgets.primary === `editor` && router.currentRoute.value.name === `Home`) {
		router.push(`/write`);
		delayActiveDraft.value = true;
		return;
	}
	router.push(`/write`);
	draftStore.setActiveDraft(i);
}

function deleteDraft() {
	const i = draftStore.getDraftIndex(props.draft);
	draftStore.deleteDraft(i);
	emit(`closeDraftsPopup`);
}

function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}

onBeforeUnmount(() => {
	if (delayActiveDraft.value) {
		const i = draftStore.getDraftIndex(props.draft);
		draftStore.setActiveDraft(i);
	}
});

onMounted(() => {
	window.addEventListener(
		`click`,
		(e: any) => {
			if (!e.target) {
				return;
			}
			if (
				e.target.parentNode === null ||
				e.target.parentNode.classList === undefined ||
				!e.target.parentNode.classList.contains(`toggleRepost`)
			) {
				showDelete.value = false;
			}
		},
		true,
	);
});

// IF featuredPhotoCID: fetch featuredPhoto
</script>

<template>
	<div class="my-2 w-full flex flex-row items-center justify-between cursor-pointer">
		<!-- Title -->
		<button class="flex flex-grow flex-col overflow-hidden focus:outline-none" @click="setActiveDraft">
			<h6
				class="truncate text-base font-semibold dark:text-darkPrimaryText"
				:style="$route.name === `home` && inWidget ? `max-width: 259px` : `max-width: 390px`"
			>
				{{ draft.title === `` ? `New Post` : draft.title }}
			</h6>
			<p class="text-gray5 dark:text-gray3 text-sm">Last saved {{ formatDate(draft.timestamp) }}</p>
		</button>
		<!-- Featured image -->
		<button
			class="mx-4 w-24 flex-shrink-0 items-center focus:outline-none"
			:class="inWidget ? `hidden xl:flex` : `flex`"
			@click="setActiveDraft"
		>
			<img
				v-if="featuredPhoto !== null"
				v-lazy="{ src: featuredPhoto }"
				:alt="draft.title"
				class="h-16 w-full flex-shrink-0 rounded-lg object-cover"
			/>
			<span
				v-else
				class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray2 flex h-16 w-24 items-center justify-center rounded-lg"
			>
				<ImageIcon class="h-5 w-5 fill-current" />
			</span>
		</button>
		<div class="icon relative flex items-center">
			<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="toggleDropdownDelete">
				<MoreIcon />
			</button>
			<div
				v-show="showDelete"
				class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
				:class="settings.isDarkMode ? `dropdownDraftOpenDark` : `dropdownDraftOpen`"
				style="top: 35px; right: -5px"
			>
				<button class="focus:outline-none text-primary flex" @click="setActiveDraft">
					<PencilIcon class="fill-current p-1" />
					<span class="text-primary ml-1 self-center text-sm">Edit this draft</span>
				</button>
				<!-- Delete -->
				<button class="focus:outline-none text-negative mt-2 flex" @click="deleteDraft">
					<BinIcon class="p-1" />
					<span class="text-negative ml-1 self-center text-sm">Delete this draft</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style>
.dropdownDraftOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownDraftOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>
