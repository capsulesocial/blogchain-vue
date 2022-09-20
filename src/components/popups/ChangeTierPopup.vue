<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue';
import Avatar from '@/components/Avatar.vue';
import CloseIcon from '@/components/icons/XIcon.vue';
import EditTierSelect from '@/components/EditTierSelect.vue';
import EditTierConfirm from '../EditTierConfirm.vue';
import { useStore } from '@/store/session';
import { ISubscriptionWithProfile } from '@/store/subscriptions';
import {
	usePaymentsStore,
	SubscriptionTier,
	PaymentProfile,
	createDefaultPaymentProfile,
} from '@/store/paymentProfile';
import { canSwitchSubscription } from '@/backend/payment';
import { toastError, handleError } from '@/plugins/toast';
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
});

const store = useStore();
const usePayment = usePaymentsStore();
const step = ref<number>(0);
const selectedTier = ref<SubscriptionTier>(props.toPreSelectTier);
const selectedPeriod = ref<string>(`month`);
const paymentProfile = ref<PaymentProfile>(createDefaultPaymentProfile(store.$state.id));
const canSwitchTier = ref<boolean>(true);

defineEmits([`close`]);

onMounted(async (): Promise<void> => {
	usePayment.getPaymentProfile(props.author.id);
	// prefill selected tier
	if (props.toPreSelectTier) {
		selectedTier.value = props.toPreSelectTier;
	}
	try {
		const canSwitchResponse = await canSwitchSubscription(store.$state.id, props.sub.subscriptionId);
		canSwitchTier.value = canSwitchResponse;
		return;
	} catch (err) {
		handleError(err);
	}
});

// methods
async function initializeProfile(): Promise<void> {
	if (!props.author) {
		toastError(`Author profile is missing`);
		return;
	}
	paymentProfile.value = await usePayment.getPaymentProfile(props.author.id);
	if (!paymentProfile.value) {
		toastError(`Payment profile of author is missing`);
		return;
	}
	if (!paymentProfile.value.stripeAccountId) {
		toastError(`Author subscription profile is missing`);
		return;
	}
	if (!paymentProfile.value.paymentsEnabled) {
		toastError(`Author hasn't enabled subscriptions`);
		return;
	}
	if (!paymentProfile.value.tiers) {
		toastError(`Author hasn't set-up subscriptions`);
	}
}
function nextStep(selectTier: SubscriptionTier, selectPeriod: string): void {
	selectedTier.value = selectTier;
	selectedPeriod.value = selectPeriod;
	step.value += 1;
}

initializeProfile();
</script>
<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="author !== null"
				class="w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<!-- avatar, name, id -->
					<div v-if="step !== 3" class="flex flex-row">
						<Avatar
							class="flex-shrink-0"
							:author-i-d="author.id"
							:avatar="props.authorAvatar"
							:no-click="true"
							:size="`w-14 h-14`"
						/>
						<div class="flex flex-col ml-4">
							<h4 v-if="author.name !== ``" class="text-xl font-semibold dark:text-darkPrimaryText">
								{{ author.name }}
							</h4>
							<h4 v-else class="text-xl font-semibold text-gray5 dark:text-gray3">
								{{ author.id }}
							</h4>
							<h5 class="text-lg text-primary dark:text-secondary">@{{ author.id }}</h5>
						</div>
					</div>
					<div v-else></div>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<!-- Step 0: Change tier -->
				<article v-if="step === 0">
					<EditTierSelect
						:payment-profile="paymentProfile"
						:can-switch-tier="canSwitchTier"
						:sub="props.sub"
						:author="props.author"
						@next-step="nextStep"
					/>
				</article>
				<!-- Step 1: Confirmation page -->
				<article v-if="step === 1" class="flex flex-col items-center">
					<EditTierConfirm
						:author="props.author"
						:sub="props.sub"
						:selected-tier="selectedTier"
						:selected-period="selectedPeriod"
						:payment-profile="paymentProfile"
						@close="$emit(`close`)"
					/>
				</article>
			</div>
		</section>
	</div>
</template>