<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { formatDate } from '@/helpers/helpers';
import { getCurrencySymbol } from '@/backend/payment';
import Avatar from '@/components/Avatar.vue';

import MoreIcon from '@/components/icons/MoreIcon.vue';
import PenIcon from '@/components/icons/Pencil.vue';
import CrownIcon from '@/components/icons/CrownIcon.vue';

const props = defineProps({
	subscription: {
		type: Object,
		required: true,
	},
});

const settings = useStoreSettings();
const showEdit = ref<boolean>(false);
const currency = ref<string>(getCurrencySymbol(props.subscription.currency));

defineEmits(['subInfoPopup']);
</script>

<template>
	<div
		class="w-full sm:w-56 mb-4 sm:mx-1 flex flex-col border border-lightBorder dark:border-darkBorder shadow-sm rounded-lg bg-lightBG dark:bg-darkBG items-center p-4"
	>
		<div class="w-full flex justify-end -mt-2">
			<div class="icon relative flex items-center">
				<button class="focus:outline-none text-gray5 dark:text-gray3 ml-2" @click.stop="showEdit = !showEdit">
					<MoreIcon />
				</button>
				<div
					v-show="showEdit"
					class="bg-lightBG dark:bg-darkBG dark:text-darkPrimaryText text-lightPrimaryText border-lightBorder modal-animation absolute z-10 flex w-44 flex-col rounded-lg border p-2 shadow-lg"
					:class="settings.isDarkMode ? `dropdownSubOpenDark` : `dropdownSubOpen`"
					style="top: 35px; right: -5px"
				>
					<button
						class="focus:outline-none text-primary flex justify-center items-center"
						@click="$emit(`subInfoPopup`, props.subscription), (showEdit = !showEdit)"
					>
						<PenIcon class="fill-current h-4 w-4" />
						<span class="text-primary ml-2 self-center text-xs">Manage Subscription</span>
					</button>
				</div>
			</div>
		</div>
		<Avatar
			:cid="subscription.avatar"
			:authorid="subscription.authorID"
			:size="`w-12 h-12 xl:w-14 xl:h-14`"
			class="mb-4"
		/>
		<h5
			v-if="subscription.name !== ``"
			class="w-full text-center font-semibold text-lg text-lightPrimaryText dark:text-darkPrimaryText truncate"
		>
			{{ subscription.name }}
		</h5>
		<h5 v-else class="w-full text-center font-semibold text-lg text-gray5 dark:text-gray3 truncate">
			{{ subscription.authorID }}
		</h5>
		<h6 class="text-primary w-full text-center truncate">@{{ subscription.authorID }}</h6>
		<!-- Crown with tier label -->
		<div
			class="w-full border border-neutral rounded-lg flex flex-row justify-center items-center bg-neutral bg-opacity-25 p-2 my-4 max-w-full"
		>
			<CrownIcon class="text-neutral mr-2 w-5 h-5" /><span class="truncate text-neutral">{{
				subscription.tier.name
			}}</span>
		</div>
		<div class="flex justify-center items-end mb-4 text-neutral">
			<p class="font-semibold text-lg">{{ currency }}{{ subscription.amount.toLocaleString() }}</p>
			<p>/</p>
			<p>{{ subscription.period }}</p>
		</div>
		<p class="text-gray5 dark:text-gray3 text-sm w-full mb-2">
			Subscribed since <span class="font-semibold">{{ formatDate(subscription.createdAt, true) }}</span>
		</p>
		<p
			v-if="
				subscription.renewalInfo && subscription.renewalInfo.status === 'cancelled' && subscription.renewalInfo.dueDate
			"
			class="text-negative text-sm w-full"
		>
			Cancels on <span class="font-semibold">{{ formatDate(subscription.renewalInfo.dueDate, true) }}</span>
		</p>
		<p v-else-if="subscription.expiredAt" class="text-gray5 dark:text-gray3 text-sm w-full">
			Next Renewal on <span class="font-semibold">{{ formatDate(subscription.expiredAt, true) }}</span>
		</p>
	</div>
</template>

<style>
.dropdownSubOpen::before {
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
.dropdownSubOpenDark::before {
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
