<script setup lang="ts">
import { ref, PropType, onMounted, computed } from 'vue';
import { StripeElements, PaymentRequest, StripeCardElement } from '@stripe/stripe-js';
import { useStore } from '@/store/session';
import { useRoute } from 'vue-router';
import Avatar from '@/components/Avatar.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import CloseIcon from '@/components/icons/XIcon.vue';
import CrownIcon from '@/components/icons/Crown.vue';
import CheckCircleIcon from '@/components/icons/CheckCircle.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import CreditCardIcon from '@/components/icons/CreditCard.vue';
import AppleIcon from '@/components/icons/brands/Apple.vue';
import GoogleIcon from '@/components/icons/brands/Google.vue';
import SwitchPeriod from '@/components/ToggleSwitch.vue';
import BasicSwitch from '@/components/BasicSwitch.vue';
import FriendButton from '@/components/FriendButton.vue';
import { useSubscriptionStore } from '@/store/subscriptions';
import { Profile } from '@/backend/profile';
import { getAmountFromTier, getCurrencySymbol, getZeroDecimalAmount, retrieveReaderProfile } from '@/backend/payment';
import { usePaymentsStore, PaymentProfile, createDefaultPaymentProfile } from '@/store/paymentProfile';
import { toastError, toastSuccess, handleError } from '@/plugins/toast';
import { followChange, getFollowersAndFollowing } from '@/backend/following';
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent';
import { darkMode } from '@/plugins/colors';

const props = defineProps({
	isSubscribed: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
	author: {
		type: Object as PropType<Profile>,
		required: true,
	},
	authorAvatar: {
		type: String as PropType<ArrayBuffer | string | null>,
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
const route = useRoute();
const useSubscription = useSubscriptionStore();
const usePayments = usePaymentsStore();
const step = computed(() => useSubscription.getStep);
const selectedTier = computed(() => useSubscription.$state.selectedTier);
const selectedPeriod = computed(() => useSubscription.$state.selectedPeriod);
const paymentProfile = ref<PaymentProfile>(createDefaultPaymentProfile(route.params.id as string));
const cardErrorMessage = computed(() => useSubscription.$state.cardErrorMessage);
const saveEmail = computed(() => useSubscription.$state.saveEmail);
const customerEmail = ref<string>(``);
const displayButtons = ref({
	applePay: false,
	googlePay: false,
});
const isLoading = ref<boolean>(false);
const userIsFollowed = ref<boolean>(false);
const following = ref<Set<string>>(new Set());
let paymentRequest: PaymentRequest | null = null;
let elements: StripeElements | null = null;
let cardElement: StripeCardElement | null = null;

const emit = defineEmits([`close`]);

onMounted(async (): Promise<void> => {
	paymentProfile.value = await usePayments.getPaymentProfile(props.author.id);
	void getFollowersAndFollowing(store.$state.id).then((data) => {
		following.value = data.following;
		userIsFollowed.value = data.following.has(props.author.id);
	});
	void retrieveReaderProfile(store.$state.id).then(({ email }) => {
		customerEmail.value = email ?? ``;
	});
	initializeProfile();
});

// methods
function startReading() {
	emit(`close`);
	useSubscription.fetchSubs(store.$state.id);
	if (route.name === `post-post`) {
		location.reload();
	}
	if (route.name === `id-id`) {
		toastSuccess(`Subscribed! Reloading profile...`);
		setTimeout(() => {
			location.reload();
		}, 4000);
	}
}
function displayCurrency(currency: string) {
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
function switchPeriod(): void {
	if (selectedPeriod.value === `month`) {
		useSubscription.updateSelectedPeriod(`year`);
	} else {
		useSubscription.updateSelectedPeriod(`month`);
	}
}
function showPaymentButtons(period: string) {
	if (selectedTier.value !== null) {
		_showPaymentButtons(period);
	}
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
		useSubscription.updateCardMessage(`null`);
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
function nextStep(): void {
	useSubscription.nextStep();
}
function previousStep(): void {
	useSubscription.previousStep();
}
async function submitCardPayment(e: HTMLInputEvent): Promise<void> {
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
async function toggleFriend(): Promise<void> {
	try {
		await followChange(userIsFollowed.value ? `UNFOLLOW` : `FOLLOW`, store.$state.id, props.author.id);
		toastSuccess(userIsFollowed.value ? `Unfollowed ${props.author.id}` : `Followed ${props.author.id}`);
		const { following } = await getFollowersAndFollowing(store.$state.id, true);
		userIsFollowed.value = following.has(props.author.id);
	} catch (err: unknown) {
		handleError(err);
	}
}
function toggleSaveEmail(): void {
	useSubscription.updateEmail(!useSubscription.$state.saveEmail);
}
</script>
<template>
	<Teleport to="#subPopup">
		<div
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
			@click.self="$emit(`close`)"
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
								:author-i-d="author.id"
								:avatar="props.author.avatar"
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
						<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click.stop="$emit(`close`)">
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
								<span v-if="author.name !== ``" class="font-semibold text-primary dark:text-secondary">{{
									author.name
								}}</span>
								<span v-else class="font-semibold text-primary dark:text-secondary">@{{ author.id }}</span>
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
									(tier.monthlyEnabled && selectedPeriod === `month`) ||
									(tier.yearlyEnabled && selectedPeriod === `year`)
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
								@click.stop="useSubscription.updateSelectedTier(tier)"
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
								<span class="font-semibold text-primary dark:text-secondary">{{ author.name }}</span>
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
								<SecondaryButton v-if="!isLoading" :text="`Pay`" @submit-payment="submitCardPayment" />
								<div class="w-full">
									<button class="text-primary self-center text-sm" @click.stop="step = 5">Payment policy</button>
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
						<div class="w-full flex flex-col justify-center text-center px-10">
							<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
							<h6 class="font-semibold text-neutral text-xl mb-2">Congrats!</h6>
							<p class="text-base text-center text-gray5 dark:text-gray3 mb-4">You are now subscribed to:</p>
						</div>
						<!-- Premium profile preview -->
						<div class="flex flex-row items-center p-4 border border-neutral rounded-lg w-2/3">
							<Avatar
								class="flex-shrink-0"
								:author-i-d="author.id"
								:avatar="props.author.avatar"
								:no-click="true"
								:size="`w-14 h-14`"
							/>
							<div class="flex flex-col ml-4 flex-grow w-3/5">
								<h4 v-if="author.name !== ``" class="text-xl font-semibold dark:text-darkPrimaryText">
									{{ author.name }}
								</h4>
								<h4 v-else class="text-xl font-semibold text-gray5 dark:text-gray3">
									{{ author.id }}
								</h4>
								<h5
									class="text-lg text-primary dark:text-secondary w-full overflow-hidden"
									style="text-overflow: ellipsis"
								>
									@{{ author.id }}
								</h5>
							</div>
							<div
								class="bg-neutral bg-opacity-25 rounded-3xl border border-neutral px-3 py-2 text-neutral text-xs mt-2 truncate pl-2"
							>
								{{ selectedTier ? selectedTier.name : `` }}
							</div>
						</div>
						<div class="w-full flex flex-col justify-center items-center text-center px-10 mt-5">
							<p class="text-base text-center text-gray5 dark:text-gray3 mb-4 max-w-md">
								All premium articles under {{ selectedTier ? selectedTier.name : `` }} tier<br />
								are now unlocked for your account.
							</p>
							<button
								v-if="userIsFollowed"
								class="px-5 py-2 rounded-lg bg-neutral focus:outline-none text-white mt-6 font-semibold"
								@click.stop="startReading"
							>
								Start reading
							</button>
							<div v-else class="flex flex-col items-center">
								<p class="text-base text-center text-gray5 dark:text-gray3 mb-4 max-w-md">
									Don't forget to follow this author to see<br />
									their latest posts on your home feed:
								</p>
								<FriendButton :toggle-friend="toggleFriend" :user-is-followed="userIsFollowed" />
							</div>
						</div>
						<img
							loading="lazy"
							:src="darkMode ? `@/assets/brand/dark/subscriptions.webp` : `@/assets/brand/light/subscriptions.webp`"
							class="h-auto rounded-lg"
						/>
					</article>
					<!-- Step 5: Payment policy page -->
					<article v-show="step === 5" class="modal-animation">
						<!-- back button -->
						<button class="flex items-center mb-4" @click="step = 2">
							<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
								<ChevronLeft />
							</div>
							<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
								>Payments</span
							>
						</button>
						<!-- Page title -->
						<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl xl:text-3xl font-semibold">
							Renewal, Refund &amp; Cancellation Policy
						</h1>
						<h2 class="text-primary mb-2 mt-4 text-lg font-semibold">
							Blogchain provides a platform for authors to be paid directly by readers. Blogchain will not refund on
							behalf of authors. Authors can issue refunds to readers at their discretion.
						</h2>
						<article class="message w-full">
							<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">
								How do I request a refund on my subscription?
							</h2>
							<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
								Refunds are issued at the discretion of the Author. Please contact them directly.
							</p>
							<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold py-2">
								Important note:
							</h2>
							<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
								Subscription refunds from the author will not revoke access to your “subscribers only” posts for the
								current month.
							</p>
							<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">
								Cancellation Policy
							</h2>
							<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
								In the event of a subscription cancellation by the author or subscribed reader, the subscription will
								cancel at the period's end. Subscription cancellation will stop the auto-renewal of readers'
								subscriptions. The reader will still have access to content under that subscription until the end of the
								month of the cancellation.
							</p>
							<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">Renewal Policy</h2>
							<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
								Reader’s subscription will auto-renew with existing price plans based on monthly or yearly subscription
								dates. Subscribed reader’s will receive an email notification from Stripe for each subscription
								immediately after the renewal payment has been fully processed.
							</p>
						</article>
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
	</Teleport>
</template>
