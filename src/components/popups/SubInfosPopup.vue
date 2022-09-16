<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue';
import Avatar from '@/components/Avatar.vue';
import CancelIcon from '@/components/icons/CancelIcon.vue';
import CardIcon from '@/components/icons/CardIcon.vue';
import CloseIcon from '@/components/icons/XIcon.vue';
import CheckCircleStaticIcon from '@/components/icons/CheckCircleIcon.vue';
import DownloadIcon from '@/components/icons/FileDownload.vue';
import BasicConfirmAlert from '@/components/popups/BasicConfirmAlert.vue';
import { useStore } from '@/store/session';
import { useSubscriptionStore } from '@/store/subscriptions';
import { usePaymentsStore } from '@/store/paymentProfile';
import { formatDate } from '@/helpers/helpers';
import { getBillingPortalUrl, getCurrencySymbol } from '@/backend/payment';
import { SubsTransaction } from '@/backend/subscription';
import { ISubscriptionWithProfile } from '@/store/subscriptions';
import { PaymentProfile } from '@/store/paymentProfile';
import { toastSuccess } from '@/plugins/toast';

const props = defineProps({
	sub: {
		type: Object as PropType<ISubscriptionWithProfile>,
		required: true,
	},
});

const store = useStore();
const useSubscription = useSubscriptionStore();
const usePayment = usePaymentsStore();
const transactions = ref<SubsTransaction[]>([]);
const showAlert = ref<boolean>(false);
const paymentProfile = ref<PaymentProfile>();
const currency = ref<string>(getCurrencySymbol(props.sub.currency));

const emit = defineEmits(['close', 'switchPopup']);

onMounted(async () => {
	paymentProfile.value = await usePayment.getPaymentProfile(props.sub.authorID);
	transactions.value = await useSubscription.getSubsTransactions(store.$state.id, props.sub.subscriptionId);
});

// methods
function downloadReceipt(url: string) {
	window.open(url, `_blank`, `noopener,noreferrer`);
}
async function manageBilling(): Promise<void> {
	try {
		const portalUrl = await getBillingPortalUrl(store.$state.id, props.sub.subscriptionId);
		window.open(portalUrl, `_blank`);
	} catch (ex: any) {
		throw new Error(ex);
	}
}
function toggleCancelAlert() {
	showAlert.value = !showAlert.value;
}
function toggleSwitchPopup(subProfile: ISubscriptionWithProfile) {
	emit(`switchPopup`, { sub: subProfile, avatar: subProfile.avatar });
	emit(`close`);
}
async function cancelSubscription() {
	const cancelSub = await useSubscription.cancelSub(store.$state.id, props.sub.subscriptionId);
	if (cancelSub) {
		toastSuccess(`Subscription cancellation was successful`);
		return;
	}
}
</script>
<template>
	<Teleport to="#popup">
		<div
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="$emit(`close`)"
		>
			<!-- Container -->
			<div
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-5 shadow-lg"
			>
				<BasicConfirmAlert
					v-if="showAlert"
					:text="`Are you sure you want to cancel this subscription? You can still re-subscribe to this author later`"
					@close="showAlert = false"
					@confirm="cancelSubscription"
				/>
				<!-- popup title -->
				<div class="sticky flex items-center justify-between mb-6">
					<div class="flex items-center">
						<h2
							v-if="props.sub.name !== ``"
							class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold truncate"
						>
							{{ props.sub.name }}
						</h2>
						<h2 v-else class="text-lightSecondaryText dark:text-darkPrimaryText text-2xl font-semibold">
							{{ props.sub.authorID }}
						</h2>
						<!-- tier -->
						<div class="bg-neutral ml-4 bg-opacity-25 rounded-3xl border border-neutral px-3 py-1 text-neutral text-xs">
							{{ props.sub.tier.name }}
						</div>
						<div class="flex justify-center items-end ml-4 text-neutral">
							<p class="font-semibold text-lg">{{ currency }}{{ props.sub.amount.toLocaleString() }}</p>
							<p>/</p>
							<p>{{ props.sub.period }}</p>
						</div>
					</div>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<!-- sub infos -->
				<div class="flex justify-between items-center">
					<!-- avatar/name -->
					<div class="flex items-center">
						<Avatar
							:avatar="props.sub.avatar"
							:authorid="props.sub.authorID"
							:size="`w-12 h-12 xl:w-14 xl:h-14`"
							class="mr-4"
						/>
						<div class="flex flex-col">
							<span v-if="props.sub.name !== ``" class="text-base font-medium dark:text-darkPrimaryText">
								{{ props.sub.name }}
							</span>
							<span v-else class="text-gray5 dark:text-gray3 text-base font-medium">{{ props.sub.authorID }}</span>
							<p class="text-primary text-sm mb-1">@{{ props.sub.authorID }}</p>
						</div>
					</div>
					<!-- infos -->
					<div class="flex flex-col mr-1 text-xs text-gray5 dark:text-gray3">
						<p class="text-gray5 dark:text-gray3 text-sm w-full mb-2">
							Subscribed since <span class="font-semibold">{{ formatDate(props.sub.createdAt, true) }}</span>
						</p>
						<p
							v-if="
								props.sub.renewalInfo && props.sub.renewalInfo.status === 'cancelled' && props.sub.renewalInfo.dueDate
							"
							class="text-negative text-sm w-full"
						>
							Cancels on <span class="font-semibold">{{ formatDate(props.sub.renewalInfo.dueDate, true) }}</span>
						</p>
						<p v-else-if="props.sub.expiredAt" class="text-gray5 dark:text-gray3 text-sm w-full">
							Next Renewal on <span class="font-semibold">{{ formatDate(props.sub.expiredAt, true) }}</span>
						</p>
					</div>
				</div>
				<!-- actions -->
				<div class="flex flex-col lg:flex-row justify-between items-center my-4">
					<button class="text-primary py-2 text-sm flex flex-row items-center" @click="manageBilling">
						<CardIcon class="h-5 w-5 mr-2" />
						<p class="focus:outline-none text-sm">Change billing method</p>
					</button>
					<button
						v-if="props.sub.isActive && (!props.sub.renewalInfo || props.sub.renewalInfo.status !== 'cancelled')"
						class="text-neutral px-2 py-2 text-sm flex flex-row items-center"
						@click="toggleSwitchPopup(props.sub)"
					>
						<CheckCircleStaticIcon class="h-5 w-5 mr-2" :is-checked="true" />
						<p class="focus:outline-none text-sm">Change tier</p>
					</button>
					<button
						v-if="props.sub.isActive && (!props.sub.renewalInfo || props.sub.renewalInfo.status !== 'cancelled')"
						class="text-negative py-2 text-sm flex flex-row items-center"
						@click="toggleCancelAlert"
					>
						<CancelIcon class="h-5 w-5 mr-2" />
						<p class="focus:outline-none text-sm">Cancel my subscription</p>
					</button>
				</div>
				<!-- divider -->
				<div class="bg-gray1 dark:bg-darkBorder w-full rounded-lg" style="height: 1px"></div>
				<!-- payment history -->
				<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold my-4">Payment history</h3>
				<div class="flex flex-row justify-start mb-2 text-gray5 dark:text-gray3">
					<h4 class="text-sm font-semibold w-40">Date</h4>
					<h4 class="text-sm font-semibold w-40">Amount</h4>
					<h4 class="text-sm font-semibold w-32">Status</h4>
					<h4 class="text-sm font-semibold">Actions</h4>
				</div>
				<div
					v-for="transaction in transactions"
					:key="transaction.transactionId"
					class="text-sm flex flex-row justify-start items-center py-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
				>
					<h4 class="w-40">{{ formatDate(transaction.createdAt) }}</h4>
					<h4 class="w-40 uppercase">{{ transaction.currency }} {{ transaction.amount.toLocaleString() }}</h4>
					<div class="w-32">
						<h4
							class="text-positive bg-positive bg-opacity-10 border border-positive px-3 py-1 text-sm rounded-3xl w-min"
						>
							{{ transaction.status }}
						</h4>
					</div>
					<button
						class="text-gray5 dark:text-gray3 py-2 text-sm flex flex-row items-center"
						@click="downloadReceipt(transaction.receiptUrl)"
					>
						<DownloadIcon class="h-5 w-5 mr-1" />
						<p class="focus:outline-none text-sm">Receipt</p>
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
