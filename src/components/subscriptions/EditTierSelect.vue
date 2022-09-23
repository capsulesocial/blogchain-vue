<script setup lang="ts">
import { ref, PropType } from 'vue';
import SwitchPeriod from '@/components/ToggleSwitch.vue';
import CrownIcon from '@/components/icons/Crown.vue';
import CheckCircleIcon from '@/components/icons/CheckCircle.vue';
import TierSwitchButton from '@/components/subscriptions/TierSwitchButton.vue';
import { ISubscriptionWithProfile } from '@/store/subscriptions';
import { SubscriptionTier, PaymentProfile } from '@/store/paymentProfile';
import { Profile } from '@/backend/profile';
import { getCurrencySymbol } from '@/backend/payment';

const props = defineProps({
	author: {
		type: Object as PropType<Profile>,
		required: true,
	},
	sub: {
		type: Object as PropType<ISubscriptionWithProfile>,
		required: true,
	},
	authorAvatar: {
		type: String as PropType<string | undefined>,
		default: null,
	},
	toPreSelectTier: {
		type: Object as PropType<SubscriptionTier>,
		default: null,
	},
	enabledTiers: {
		type: Array as PropType<string[]>,
		default: () => {
			return [];
		},
	},
	canSwitchTier: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
	paymentProfile: {
		type: Object as PropType<PaymentProfile>,
		required: true,
	},
});

const canSwitchTier = ref<boolean>(true);
const selectedTier = ref<SubscriptionTier>(props.toPreSelectTier);
const selectedPeriod = ref<string>(`month`);
const emit = defineEmits([`close`, 'nextStep']);
const text = ref(`Next`);
const toEmit = ref(`nextStep`);

function selectTier(tier: SubscriptionTier): void {
	selectedTier.value = tier;
}
function switchPeriod(): void {
	if (selectedPeriod.value === `month`) {
		selectedPeriod.value = `year`;
	} else {
		selectedPeriod.value = `month`;
	}
}
function displayCurrency(currency: string): string {
	return getCurrencySymbol(currency);
}
function getStyles(DisplayedTier: SubscriptionTier): string {
	let res = ``;
	if (props.sub.tier.id === DisplayedTier._id) {
		// current tier
		res = `opacity-75 cursor-not-allowed border-gray5`;
	} else if (props.enabledTiers.length > 0 && !props.enabledTiers.includes(DisplayedTier._id)) {
		// not in enabled tiers for this post
		res = `opacity-75 cursor-not-allowed border-lightBorder dark:border-darkBorder`;
	} else if (selectedTier.value?._id === DisplayedTier._id) {
		// in enabled tier and selected
		res = `opacity-100 cursor-pointer border-neutral`;
	} else {
		// in enabled tier but not selected
		res = `opacity-100 cursor-pointer border-lightBorder dark:border-darkBorder`;
	}
	return res;
}

function nextStep(): void {
	emit(`nextStep`, selectedTier.value, selectedPeriod.value);
}
</script>
<template>
	<!-- Step 0: Change tier -->
	<article>
		<div class="w-full flex flex-col justify-center text-center px-10">
			<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
			<h6 class="font-semibold text-neutral text-xl mb-2">Change Tier</h6>
			<p v-if="canSwitchTier" class="text-base text-center text-gray5 dark:text-gray3 mb-4">
				Easily change your Tier access of
				<span v-if="author.name !== ``" class="font-semibold text-primary dark:text-secondary">{{ author.name }}</span>
				<span v-else class="font-semibold text-primary dark:text-secondary">@{{ author.id }}</span>
				to access new content
			</p>
		</div>
		<div v-if="!canSwitchTier">
			<p class="text-base text-center text-gray5 dark:text-gray3 mb-10 mt-2">
				You already switched Tiers for this author within the last 30 days. <br />
				You must wait for your next payment to process before changing the subscription tier again.
			</p>
			<div class="flex flex-row-reverse">
				<button
					class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
					style="padding: 0.4rem 1.5rem"
					@click="$emit(`close`)"
				>
					<span class="font-sans" style="font-size: 0.95rem"> Close </span>
				</button>
			</div>
		</div>
		<div v-else>
			<!-- Period switch -->
			<div class="w-full flex justify-center mt-1">
				<SwitchPeriod :period="selectedPeriod" @toggle="switchPeriod" />
			</div>
			<!-- Subscriptions list -->
			<div v-for="tier in paymentProfile.tiers" :key="tier._id">
				<button
					v-if="
						(tier.monthlyEnabled && selectedPeriod === `month`) || (tier.yearlyEnabled && selectedPeriod === `year`)
					"
					class="flex flex-row items-center justify-between m-5 p-4 border shadow-sm rounded-lg bg-lightBG dark:bg-darkBG transition duration-500 ease-in-out"
					:class="getStyles(tier)"
					:disabled="props.sub.tier.id === tier._id || (enabledTiers.length > 0 && !enabledTiers.includes(tier._id))"
					@click="selectTier(tier)"
				>
					<!-- Check mark -->
					<div class="w-12 flex justify-center">
						<CheckCircleIcon
							v-if="props.sub.tier.id !== tier._id"
							:is-checked="selectedTier !== null && selectedTier._id === tier._id"
							class="text-neutral w-6 h-6 flex items-center transition duration-500 ease-in-out"
						/>
						<CheckCircleIcon
							v-else
							:is-checked="true"
							class="text-gray5 w-6 h-6 flex items-center transition duration-500 ease-in-out"
						/>
					</div>
					<div class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
						<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ tier.name }}</h3>
						<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
							Get access to exclusive articles by subscribing to {{ tier.name }}
						</p>
					</div>
					<div v-if="sub.tier.id !== tier._id">
						<div
							v-if="tier.monthlyEnabled && selectedPeriod === `month`"
							class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
						>
							{{ displayCurrency(paymentProfile.currency) }}{{ tier.monthlyPrice.toLocaleString() }}
							<span class="text-gray5 dark:text-gray3">/month</span>
						</div>
						<div
							v-if="tier.yearlyEnabled && selectedPeriod === `year`"
							class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
						>
							{{ displayCurrency(paymentProfile.currency) }}{{ tier.yearlyPrice.toLocaleString() }}
							<span class="text-gray5 dark:text-gray3">/year</span>
						</div>
					</div>
					<div v-else class="font-semibold text-lg mr-2 text-gray5">Current tier</div>
				</button>
			</div>
			<div class="flex flex-row-reverse">
				<TierSwitchButton :selected-tier="selectedTier" :text="text" :to-emit="toEmit" @next-step="nextStep" />
			</div>
		</div>
	</article>
</template>
