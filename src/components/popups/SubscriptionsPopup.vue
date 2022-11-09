<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { StripeElements, PaymentRequest, StripeCardElement } from '@stripe/stripe-js';
import { useRoute } from 'vue-router';
import { Profile } from '@/backend/profile';
import { toastError, toastSuccess } from '@/plugins/toast';
import { getAmountFromTier, getCurrencySymbol, getZeroDecimalAmount, retrieveReaderProfile } from '@/backend/payment';
import { SubscriptionTier } from '@/store/paymentProfile';

import Avatar from '@/components/Avatar.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import CloseIcon from '@/components/icons/XIcon.vue';
import CrownIcon from '@/components/icons/CrownIcon.vue';
import CheckCircleIcon from '@/components/icons/CheckCircle.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import CreditCardIcon from '@/components/icons/CreditCard.vue';
import AppleIcon from '@/components/icons/brands/Apple.vue';
import GoogleIcon from '@/components/icons/brands/Google.vue';
import SwitchPeriod from '@/components/ToggleSwitch.vue';
import BasicSwitch from '@/components/BasicSwitch.vue';
import PaymentPolicy from '@/components/subscriptions/PaymentPolicy.vue';
import SubConfirmation from '@/components/subscriptions/SubConfirmation.vue';
import { useSubscriptionStore } from '@/store/subscriptions';
import { useStore } from '@/store/session';
import { usePaymentsStore } from '@/store/paymentProfile';
import { useConnectionsStore } from '@/store/connections';

const props = withDefaults(
	defineProps<{
		isSubscribed: boolean;
		author: Profile;
		authorAvatar: ArrayBuffer | string | null;
		enabledTiers: string[];
	}>(),
	{
		isSubscribed: false,
		authorAvatar: null,
		enabledTiers: () => {
			return [];
		},
	},
);

const store = useStore();
const route = useRoute();
const useSubscription = useSubscriptionStore();
const connectionsStore = useConnectionsStore();
const usePayments = usePaymentsStore();
const step = computed(() => useSubscription.getStep);
const selectedTier = computed(() => useSubscription.$state.selectedTier);
const selectedPeriod = computed(() => useSubscription.$state.selectedPeriod);
const cardErrorMessage = computed(() => useSubscription.$state.cardErrorMessage);
const saveEmail = computed(() => useSubscription.$state.saveEmail);
const paymentProfile = computed(() => usePayments.paymentProfile(props.author.id));
const customerEmail = ref<string>(``);
const displayButtons = ref({
	applePay: false,
	googlePay: false,
});
const isLoading = ref<boolean>(false);
const userIsFollowed = computed(() => connectionsStore.getFollowStatus(store.id, props.author.id));
let paymentRequest: PaymentRequest | null = null;
let elements: StripeElements | null = null;
let cardElement: StripeCardElement | null = null;

const emit = defineEmits([`close`]);

// methods
function startReading() {
	emit(`close`);
	useSubscription.fetchSubs(store.$state.id);
	if (route.name === `Post Reader`) {
		window.location.reload();
	}

	if (route.name === `Profile` || `Posts` || `Comments` || `Reposts`) {
		toastSuccess(`Subscribed! Reloading profile...`);
		setTimeout(() => {
			window.location.reload();
		}, 4000);
	}
}

function displayCurrency(currency: string): string {
	return getCurrencySymbol(currency);
}

function initializeProfile() {
	if (!props.author) {
		toastError(`Author profile is missing`);
		return;
	}
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

function switchPeriod() {
	if (selectedPeriod.value === `month`) {
		useSubscription.updateSelectedPeriod(`year`);
	} else {
		useSubscription.updateSelectedPeriod(`month`);
	}
}

function showPaymentButtons(period: string) {
	if (!selectedTier.value._id) {
		return;
	}
	_showPaymentButtons(period);
}

async function _showPaymentButtons(period: string) {
	nextStep();
	useSubscription.updateSelectedPeriod(period);
	if (!useSubscription.$state.selectedTier || !period) {
		useSubscription.updateCardMessage(`Invalid tier selected`);
		return;
	}
	const selectedAmount = getAmountFromTier(period, useSubscription.$state.selectedTier);
	const amount = getZeroDecimalAmount(paymentProfile.value.currency, selectedAmount);
	isLoading.value = true;
	const stripe = await useSubscription.stripeClient(paymentProfile.value.stripeAccountId);
	const currency = paymentProfile.value.currency;
	paymentRequest = stripe.paymentRequest({
		country: `US`,
		currency,
		total: {
			label: `Subscription to ${useSubscription.$state.selectedTier.name}`,
			amount,
		},
		requestPayerName: true,
		requestPayerEmail: true,
	});
	isLoading.value = false;
	elements = stripe.elements();
	paymentRequest.canMakePayment().then((result: any) => {
		if (!result) {
			return;
		}
		displayButtons.value.applePay = result.applePay;
		displayButtons.value.googlePay = result.googlePay;
	});
	cardElement = elements.create(`card`, {
		iconStyle: `solid`,
		style: {
			base: {
				color: `#000000`,
				fontSize: `16px`,
				fontSmoothing: `antialiased`,
				fontWeight: 500,
				'::placeholder': {
					color: `#CFD7DF`,
				},
			},
			invalid: {
				color: `#FF4433`,
			},
		},
	});
	cardElement.on(`change`, (event: any) => {
		if (event.error) {
			useSubscription.updateCardMessage(event.error.message);
			return;
		}
	});
}

function selectPaymentType(paymentType: string) {
	if (!paymentRequest) {
		useSubscription.updateCardMessage(`Unexpected error with payment request`);
		return;
	}
	if (paymentType !== `card`) {
		paymentRequest.show();
		paymentRequest.on(`paymentmethod`, async (ev: any) => {
			if (!ev.paymentMethod.id) {
				useSubscription.updateCardMessage(`Invalid payment method`);
				ev.complete(`success`);
				return;
			}
			if (!ev.payerEmail) {
				useSubscription.updateCardMessage(`Please provide your email`);
				ev.complete(`success`);
				return;
			}
			await useSubscription.submitPayment(ev.paymentMethod, ev.payerEmail);
			isLoading.value = false;
			ev.complete(`success`);
		});
		return;
	}
	if (!cardElement) {
		useSubscription.updateCardMessage(`Couldn't load Stripe Card`);
		return;
	}
	cardElement.mount(`#card-element`);
	nextStep();
}

function nextStep() {
	useSubscription.nextStep();
}

function previousStep() {
	useSubscription.previousStep();
}

async function submitCardPayment() {
	isLoading.value = true;
	const stripe = await useSubscription.stripeClient();
	if (!cardElement) {
		isLoading.value = false;
		throw new Error(`Card elements is not initialized`);
	}
	if (!customerEmail.value) {
		useSubscription.updateCardMessage(`Invalid email address`);
		isLoading.value = false;
		return;
	}
	const { error, paymentMethod } = await stripe.createPaymentMethod({
		type: `card`,
		card: cardElement,
		billing_details: {
			email: customerEmail.value,
		},
	});
	if (error) {
		useSubscription.updateCardMessage(error.message ?? `An unknown error happened`);
		isLoading.value = false;
		return;
	}
	if (!paymentMethod) {
		useSubscription.updateCardMessage(`Invalid payment method`);
		isLoading.value = false;
		return;
	}
	await useSubscription.submitPayment(paymentMethod, customerEmail.value);
	isLoading.value = false;
}

function updateSelectedTier(tier: SubscriptionTier) {
	if (!selectedTier.value._id) {
		useSubscription.updateSelectedTier(tier);
	} else if (selectedTier.value._id !== tier._id) {
		useSubscription.updateSelectedTier(tier);
	} else {
		useSubscription.resetSelectedTier();
	}
}

async function toggleFriend() {}
function toggleSaveEmail() {
	useSubscription.updateEmail(!useSubscription.$state.saveEmail);
}

onMounted(() => {
	// Fetch updated payment profile of author
	usePayments.fetchPaymentProfile(props.author.id).then(() => {
		initializeProfile();
	});
	// Check for saved email
	retrieveReaderProfile(store.$state.id).then(({ email }) => {
		customerEmail.value = email ?? ``;
	});
});
</script>
<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="
			() => {
				$emit(`close`);
				useSubscription.$reset();
			}
		"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="author !== null"
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<!-- avatar, name, id -->
					<div v-if="step !== 3" class="flex flex-row">
						<Avatar
							class="flex-shrink-0"
							:authorid="author.id"
							:cid="props.author.avatar"
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
					<button
						class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1"
						@click.stop="
							() => {
								$emit(`close`);
								useSubscription.$reset();
							}
						"
					>
						<CloseIcon />
					</button>
				</div>
				<!-- Step 0: Choose a subscription plan -->
				<article v-show="step === 0" class="modal-animation">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Your subscription plan</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-4">
							Choose a subscription plan and a billing method to access subscribers-only content of
							<span class="font-semibold text-primary dark:text-secondary">{{
								author.name !== `` ? author.name : `@${author.id}`
							}}</span>
						</p>
					</div>
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
							:class="
								selectedTier !== null && selectedTier._id === tier._id
									? props.enabledTiers.includes(tier._id) || props.enabledTiers.length === 0
										? `opacity-100 cursor-pointer border-neutral`
										: `opacity-50 cursor-not-allowed border-neutral`
									: props.enabledTiers.includes(tier._id) || props.enabledTiers.length === 0
									? `opacity-100 cursor-pointer border-lightBorder dark:border-darkBorder`
									: `opacity-50 cursor-not-allowed border-lightBorder dark:border-darkBorder`
							"
							:disabled="!(props.enabledTiers.includes(tier._id) || props.enabledTiers.length === 0)"
							@click.stop="updateSelectedTier(tier)"
						>
							<!-- Check mark -->
							<div class="w-12 flex justify-center">
								<CheckCircleIcon
									:is-checked="selectedTier !== null && selectedTier._id === tier._id"
									class="text-neutral w-6 h-6 flex items-center transition duration-500 ease-in-out"
								/>
							</div>
							<div class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
								<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ tier.name }}</h3>
								<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
									Get access to exclusive articles by subscribing to {{ tier.name }}
								</p>
							</div>
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
						</button>
					</div>
					<div class="flex flex-row-reverse">
						<button
							:class="selectedTier._id !== `` ? `` : `opacity-50 cursor-not-allowed`"
							class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
							style="padding: 0.4rem 1.5rem"
							@click.stop="showPaymentButtons(selectedPeriod)"
						>
							<span class="font-sans" style="font-size: 0.95rem"> Next </span>
						</button>
					</div>
				</article>
				<!-- Step 1: Payment method selection -->
				<article v-show="step === 1" class="modal-animation">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Your order</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-2">
							{{ selectedTier ? selectedTier.name : `` }}
							{{ selectedPeriod === `month` ? 'monthly' : 'yearly' }} subscription plan to
							<span class="font-semibold text-primary dark:text-secondary">{{
								author.name ? author.name : `@${author.id}`
							}}</span>
						</p>
						<div v-if="selectedTier !== null" class="font-semibold text-lg mb-4 dark:text-darkPrimaryText">
							{{ displayCurrency(paymentProfile.currency)
							}}{{
								selectedPeriod === `month`
									? selectedTier.monthlyPrice.toLocaleString()
									: selectedTier.yearlyPrice.toLocaleString()
							}}
							<span class="text-gray5 dark:text-gray3">/{{ selectedPeriod }}</span>
						</div>
					</div>
					<!-- Payment Methods -->
					<div v-show="!isLoading" class="flex flex-col items-center px-10">
						<!-- Apple pay -->
						<button
							v-show="displayButtons.applePay"
							class="w-full my-2 p-4 bg-black items-center rounded-lg flex justify-center"
							@click.stop="selectPaymentType(`applePay`)"
						>
							<AppleIcon class="text-white w-6 h-6" />
							<h6 class="text-white ml-2">Pay</h6>
						</button>
						<!-- Google pay -->
						<button
							v-show="displayButtons.googlePay"
							class="w-full my-2 p-4 border border-black bg-white items-center rounded-lg flex justify-center"
							@click.stop="selectPaymentType(`googlePay`)"
						>
							<GoogleIcon class="w-6 h-6" />
							<h6 class="text-gray5 ml-2">Pay</h6>
						</button>
						<small v-show="cardErrorMessage !== ``" style="color: #eb1c26" class="mb-5 modal-animation">{{
							cardErrorMessage
						}}</small>
						<div
							v-show="displayButtons.googlePay || displayButtons.applePay"
							class="my-6 flex w-full items-center justify-center"
						>
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
							<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
						</div>
						<!-- Credit card -->
						<button
							class="w-full mt-2 mb-5 p-4 bg-gray1 dark:bg-gray7 border border-lightBorder dark:border-darkBorder items-center rounded-lg flex justify-center"
							@click.stop.prevent="selectPaymentType(`card`)"
						>
							<CreditCardIcon class="text-gray5 dark:text-gray2 w-6 h-6" />
							<h6 class="text-gray5 dark:text-gray2 ml-2">Credit card</h6>
						</button>
						<p class="text-sm text-gray5 dark:text-gray3 mt-4 mb-1 italic">Cryptocurrency options coming soon</p>
					</div>
				</article>
				<!-- Step 2: Payment card info -->
				<article v-show="step === 2" class="modal-animation">
					<!-- Back button -->
					<div class="flex justify-between w-full mb-8 mt-8">
						<button class="flex items-center" @click.stop="previousStep">
							<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
								<ChevronLeft />
							</div>
							<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
								>Payments methods</span
							>
						</button>
						<div class="flex items-center">
							<CreditCardIcon class="text-gray5 dark:text-gray2 w-6 h-6" />
							<h6 class="text-gray5 dark:text-gray2 ml-2">Credit card</h6>
						</div>
					</div>
					<!-- Order description -->
					<div class="flex justify-between w-full mb-4">
						<p class="text-base text-center text-gray5 dark:text-gray3">
							1 x {{ selectedTier ? selectedTier.name : `` }}
							{{ selectedPeriod === `month` ? 'monthly' : 'yearly' }} subscription plan
						</p>
						<div v-if="selectedTier !== null" class="font-semibold text-lg dark:text-darkPrimaryText opacity-50">
							{{ displayCurrency(paymentProfile.currency)
							}}{{
								selectedPeriod === `month`
									? selectedTier.monthlyPrice.toLocaleString()
									: selectedTier.yearlyPrice.toLocaleString()
							}}
						</div>
					</div>
					<p class="text-negative text-sm">
						This subscription will be renewed every {{ selectedPeriod }} on the same date, you can manage your
						subscriptions on the <router-link to="/subscriptions" class="underline">subscriptions page</router-link>.
					</p>
					<div class="flex justify-between w-full mt-8 mb-8">
						<p class="text-base text-center text-gray5 dark:text-gray3">Total to pay today</p>
						<div v-if="selectedTier !== null" class="font-semibold text-lg dark:text-darkPrimaryText">
							{{ displayCurrency(paymentProfile.currency)
							}}{{
								selectedPeriod === `month`
									? selectedTier.monthlyPrice.toLocaleString()
									: selectedTier.yearlyPrice.toLocaleString()
							}}
						</div>
					</div>
					<!-- Payment infos -->
					<div>
						<div class="mb-4 flex flex-col lg:flex-row">
							<input
								id="email"
								v-model="customerEmail"
								type="email"
								placeholder="Email"
								class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray3 dark:placeholder-gray2 border border-lightBorder focus:outline-none flex-grow rounded-lg px-4 py-4 text-black"
								style="font-weight: 400; font-size: 15.8px"
							/>
						</div>
						<!-- Save email for future subscriptions -->
						<div class="flex flex-row justify-between items-center mb-4">
							<p class="text-base text-center text-gray5 dark:text-gray3">Save email for future subscriptions</p>
							<BasicSwitch :enabled="saveEmail" @toggle="toggleSaveEmail" />
						</div>
						<div
							id="card-element"
							class="mb-2 rounded-lg p-4 border border-lightBorder bg-gray1 dark:bg-gray7 placeholder-gray5 dark:placeholder-gray3 py-5"
						/>
						<small v-show="cardErrorMessage !== null" style="color: #eb1c26" class="mb-5 modal-animation">{{
							cardErrorMessage
						}}</small>
						<div class="flex flex-row-reverse items-center mt-4">
							<SecondaryButton v-if="!isLoading" :text="`Pay`" :action="submitCardPayment" :thin="false" />
							<div class="w-full">
								<button class="text-primary self-center text-sm" @click.stop="useSubscription.$state.step = 5">
									Payment policy
								</button>
							</div>
						</div>
					</div>
				</article>
				<!-- Step 3: Pay (Stripe) -->
				<article v-if="step === 3" class="modal-animation">
					<form id="payment-form">
						<div id="payment-element">
							<!--Stripe.js injects the Payment Element-->
						</div>
						<div class="mt-4 flex flex-row-reverse">
							<SecondaryButton :text="`Pay Now`" :action="submitCardPayment" />
						</div>
						<div id="payment-message" class="hidden"></div>
					</form>
				</article>
				<!-- Step 4: Confirmation page -->
				<article v-show="step === 4" class="flex flex-col items-center modal-animation">
					<SubConfirmation
						:author="props.author"
						:user-is-followed="userIsFollowed ? userIsFollowed : false"
						:toggle-friend="toggleFriend"
						:selected-tier="selectedTier"
						@start-reading="startReading"
					/>
				</article>
				<!-- Step 5: Payment policy page -->
				<article v-show="step === 5" class="modal-animation">
					<PaymentPolicy />
				</article>
				<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-5">
					<div
						class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
						:style="`border-top: 2px solid`"
					></div>
				</div>
			</div>
		</section>
	</div>
</template>
