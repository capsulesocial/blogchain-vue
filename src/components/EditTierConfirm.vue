<script setup lang="ts">
import { ref, PropType } from 'vue';
import CrownIcon from '@/components/icons/Crown.vue';
import CheckCircleIcon from '@/components/icons/CheckCircle.vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import TierSwitchButton from '@/components/TierSwitchButton.vue';
import { useStore } from '@/store/session';
import { useSubscriptionStore, ISubscriptionWithProfile } from '@/store/subscriptions';
import { SubscriptionTier, PaymentProfile } from '@/store/paymentProfile';
import { toastError, toastSuccess, handleError } from '@/plugins/toast';
import { getCurrencySymbol } from '@/backend/payment';
import { Profile } from '@/backend/profile';

const props = defineProps({
	author: {
		type: Object as PropType<Profile>,
		required: true,
	},
	sub: {
		type: Object as PropType<ISubscriptionWithProfile>,
		required: true,
	},
	selectedTier: {
		type: Object as PropType<SubscriptionTier>,
		required: true,
	},
	selectedPeriod: {
		type: String as PropType<string>,
		required: true,
	},
	paymentProfile: {
		type: Object as PropType<PaymentProfile>,
		required: true,
	},
});

const store = useStore();
const useSubscription = useSubscriptionStore();
const isLoading = ref<boolean>(false);
const text = ref(`Confirm Change`);
const toEmit = ref(`switchTier`);

const emit = defineEmits([`close`]);

// methods
function displayCurrency(currency: string): string {
	return getCurrencySymbol(currency);
}
async function switchTier(): Promise<void> {
	if (props.selectedTier === null) {
		return;
	}
	try {
		isLoading.value = true;
		const res = await useSubscription.switchSubscriptionTier(
			store.$state.id,
			props.sub.subscriptionId,
			props.selectedTier,
			props.selectedPeriod,
		);
		if (!res) {
			toastError(`Switching tier failed`);
			return;
		} else {
			toastSuccess(`Switched tiers successfully!`);
			emit(`close`);
		}
	} catch (err: any) {
		handleError(err);
	}
	isLoading.value = false;
}
</script>
<template>
	<div class="w-full flex flex-col justify-center text-center px-10">
		<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
		<h6 class="font-semibold text-neutral text-xl mb-2">Are you sure?</h6>
		<p class="text-base text-center text-gray5 dark:text-gray3">
			You are about to change the Tier subscription of author
			<span v-if="author.name !== ``" class="font-semibold text-primary dark:text-secondary">{{ author.name }}</span>
			<span v-else class="font-semibold text-primary dark:text-secondary">@{{ author.id }}</span>
		</p>
	</div>
	<!-- Tier change preview -->
	<div
		class="flex flex-row items-center justify-between m-5 p-4 border shadow-sm rounded-lg bg-lightBG dark:bg-darkBG transition duration-500 ease-in-out opacity-100 border-gray5"
	>
		<!-- Check mark -->
		<div class="w-12 flex justify-center">
			<CheckCircleIcon
				:is-checked="true"
				class="text-gray5 w-6 h-6 flex items-center transition duration-500 ease-in-out"
			/>
		</div>
		<div class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
			<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ props.sub.tier.name }}</h3>
			<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
				Get access to exclusive articles by subscribing to {{ props.sub.tier.name }}
			</p>
		</div>
		<div class="font-semibold text-lg mr-2 text-gray5">Current tier</div>
	</div>
	<ChevronDownIcon class="w-5 h-5 text-gray5 dark:text-gray3" />
	<div
		class="flex flex-row items-center justify-between m-5 p-4 border shadow-sm rounded-lg bg-lightBG dark:bg-darkBG transition duration-500 ease-in-out opacity-100 border-neutral"
	>
		<!-- Check mark -->
		<div class="w-12 flex justify-center">
			<CheckCircleIcon
				:is-checked="true"
				class="text-neutral w-6 h-6 flex items-center transition duration-500 ease-in-out"
			/>
		</div>
		<div v-if="props.selectedTier" class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
			<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ props.selectedTier.name }}</h3>
			<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
				Get access to exclusive articles by subscribing to {{ props.selectedTier.name }}
			</p>
		</div>
		<div
			v-if="props.selectedTier && props.selectedPeriod === `month`"
			class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
		>
			{{ displayCurrency(paymentProfile.currency) }}{{ props.selectedTier.monthlyPrice.toLocaleString() }}
			<span class="text-gray5 dark:text-gray3">/month</span>
		</div>
		<div
			v-if="props.selectedTier && props.selectedPeriod === `year`"
			class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
		>
			{{ displayCurrency(paymentProfile.currency) }}{{ props.selectedTier.yearlyPrice.toLocaleString() }}
			<span class="text-gray5 dark:text-gray3">/year</span>
		</div>
	</div>
	<p class="text-sm text-center text-negative px-8 mb-5 py-1">
		This change will be reflected on your next charge, using the same billing method previously setup on this
		subscription. Please note you can only change tiers once every 30 days. You can always manage your subscriptions on
		the
		<router-link to="/subscriptions" class="underline">subscriptions page</router-link>.
	</p>
	<div class="flex flex-row-reverse w-full">
		<TierSwitchButton
			:selected-tier="props.selectedTier"
			:is-loading="isLoading"
			:text="text"
			:to-emit="toEmit"
			@switch-tier="switchTier"
		/>
	</div>
</template>
