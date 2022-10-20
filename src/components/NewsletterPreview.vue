<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import BasicConfirmAlert from '@/components/popups/BasicConfirmAlert.vue';

import { useStore } from '@/store/session';
import { emailNotificationssStore } from '@/store/emailnotifications';

import { useStoreSettings } from '@/store/settings';

import { IEmailSubscription } from '@/backend/emails';

const props = withDefaults(
	defineProps<{
		newsletter: IEmailSubscription;
	}>(),
	{},
);

const storeSettings = useStoreSettings();
const store = useStore();
const emailNotification = emailNotificationssStore();

const showDelete = ref(false);
const showStatus = ref(false);
const showDeleteConfirm = ref(false);

const emit = defineEmits([`refetchSubs`]);

// methods
function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}

function handleDropdown(e: any) {
	if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
		return;
	}
	if (!e.target.parentNode.classList.contains(`icon`)) {
		showDelete.value = false;
	}
}

async function update() {
	await emailNotification.fetchNewsletters(props.newsletter.authorID, store.$state.id);
}

async function confirmDelete() {
	if (props.newsletter._id) {
		await emailNotification.deleteEmailSubsciption(props.newsletter._id, store.$state.id);
	}
	update();
	emit(`refetchSubs`);
}

onMounted(async () => {
	window.addEventListener(`click`, handleDropdown, false);
});
</script>

<template>
	<div class="my-2 flex flex-row items-center justify-between">
		<!-- newsletter email -->
		<p class="flex items-center text-primary text-sm focus:outline-none mb-2">
			{{ props.newsletter.email }}
		</p>
		<div class="flex items-center relative">
			<div class="">
				<span
					class="ml-1 flex h-3 w-3 modal-animation mr-4"
					@mouseenter="showStatus = true"
					@mouseleave="showStatus = false"
				>
					<span
						class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75"
						:class="newsletter.verified ? `bg-positive` : `bg-neutral`"
					></span>
					<span
						class="relative inline-flex h-3 w-3 rounded-full"
						:class="newsletter.verified ? `bg-positive` : `bg-neutral`"
					></span>
				</span>
				<!-- Info hover -->
				<div
					v-show="showStatus"
					class="absolute w-max z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 pr-4 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
					:class="storeSettings.$state.darkMode ? `EmailInfoOpenDark` : `EmailInfoOpen`"
					style="top: -5px; right: 80px"
				>
					{{ newsletter.verified ? 'Notification is active on this email' : 'Awaiting email verification' }}
				</div>
			</div>
			<!-- delete -->
			<div class="icon relative flex items-center">
				<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="toggleDropdownDelete">
					<MoreIcon />
				</button>
				<div
					v-show="showDelete"
					class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-min flex-col rounded-lg border p-2 shadow-lg"
					:class="storeSettings.$state.darkMode ? `deleteEmailOpenDark` : `deleteEmailOpen`"
					style="top: 35px; right: -5px"
				>
					<!-- Delete -->
					<button
						class="focus:outline-none text-negative flex"
						@click="(showDeleteConfirm = true), toggleDropdownDelete"
					>
						<BinIcon class="m-1 w-4 h-4" />
						<span class="text-negative ml-1 self-center text-sm pr-1">Delete</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<Teleport to="body">
		<BasicConfirmAlert
			v-if="showDeleteConfirm"
			:text="`Are you sure you want to cancel this email notification? You can still add it again later`"
			@close="showDeleteConfirm = false"
			@confirm="confirmDelete()"
		/>
	</Teleport>
</template>
<style>
.deleteEmailOpen::before {
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
.deleteEmailOpenDark::before {
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
.EmailInfoOpen::before {
	content: '';
	position: absolute;
	top: 0.5rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.EmailInfoOpenDark::before {
	content: '';
	position: absolute;
	top: 0.5rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #686868;
	border-radius: 2px;
	z-index: 1;
}
</style>
