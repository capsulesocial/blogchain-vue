<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store/session';
import { useProfilesStore } from '@/store/profiles';
import { usePaymentsStore } from '@/store/paymentProfile';
import { SubscriptionTier } from '@/store/paymentProfile';

import CheckCircleStaticIcon from '@/components/icons/CheckCircleStaticIcon.vue';
import SubscribeButton from '@/components/subscriptions/SubscribeButton.vue';
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue';
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue';
import { ISubscriptionWithProfile } from '@/store/subscriptions';
import { useSubscriptionStore } from '@/store/subscriptions';

const store = useStore();
const profilesStore = useProfilesStore();
const paymentStore = usePaymentsStore();
const useSubscription = useSubscriptionStore();

const props = defineProps<{
	id: string;
	hasFeaturedPhoto: boolean;
	subscriptionStatus: string;
	enabledTiers: string[];
}>();

const profile = computed(() => profilesStore.getProfile(props.id));
const enabledTierNames = ref<Array<string>>([]);
const toPreSelectTiers = ref<Array<SubscriptionTier>>([]);
const availableTiers = ref<SubscriptionTier[]>([]);
const showSubscription = ref(false);
const showChangeTier = ref(false);
const activeSub = ref<ISubscriptionWithProfile>();

onMounted(async () => {
	profilesStore.fetchProfile(props.id);
	await getTiers();
	const activeSubs = useSubscription.$state.active;
	activeSub.value = activeSubs.find((sub) => sub.authorID === profile.value.id);
});

async function getTiers() {
	//how to access get payment profile in this file?
	const paymentProfile = await paymentStore.fetchPaymentProfile(profile.value.id);
	if (paymentProfile) {
		availableTiers.value = paymentProfile.tiers;
	}
	props.enabledTiers.forEach((tId) => {
		const foundTier = availableTiers.value.find((tier: SubscriptionTier) => tier._id === tId);
		if (foundTier) {
			enabledTierNames.value.push(foundTier.name);
			toPreSelectTiers.value.push(foundTier);
		}
	});
}
</script>

<template>
	<article
		class="from-lightBGStart to-transparent dark:from-darkBGStart dark:to-transparent bg-gradient-to-t z-10 absolute top-0 w-full h-full flex overflow-hidden"
	>
		<div
			class="w-full shadow-lg flex flex-col items-center py-10 px-16 bg-lightBG dark:bg-darkBGStop rounded-lg h-full"
			:class="hasFeaturedPhoto ? `sm:mt-36` : `mt-0`"
		>
			<!-- Not a subscriber -->
			<div v-if="props.subscriptionStatus === `NOT_SUBSCRIBED` || !store.$state.id">
				<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">This post is for Paid subscribers</h4>
				<p class="my-4 text-center text-gray5 dark:text-gray3">
					Become a subscriber of
					<span v-if="profile.name !== ``" class="font-semibold text-primary">{{ profile.name }}</span>
					<span v-else class="font-semibold text-primary">@{{ profile.id }}</span> to access
					<br class="hidden lg:block" />
					this post and other subscriber-only content
				</p>
				<div class="flex items-center justify-center header-profile my-4" style="transform: scale(1.2)">
					<SubscribeButton :is-subscribed="false" :action="() => (showSubscription = !showSubscription)" />
				</div>
				<p v-if="store.$state.id" class="text-sm mt-8 text-center text-gray5 dark:text-gray3">
					Manage my <router-link to="/subscriptions" class="text-neutral text">subscriptions</router-link>
				</p>
			</div>

			<!-- Subscribed, but to a different tier -->
			<div v-if="props.subscriptionStatus === `INSUFFICIENT_TIER`">
				<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">
					Your subscription tier does not include this post
				</h4>
				<p class="my-4 text-center text-gray5 dark:text-gray3">
					Subscribe to the
					<span v-for="(tier, index) in enabledTierNames.slice(0, 1)" :key="index" class="text-neutral font-semibold">{{
						tier
					}}</span>
					tier of
					<span v-if="profile.name !== ``" class="font-semibold text-primary">{{ profile.name }}</span>
					<span v-else class="font-semibold text-primary">@{{ profile.id }}</span> to access
					<br class="hidden lg:block" />
					this post and other posts of this tier.
				</p>
				<!-- change tier -->
				<div class="flex items-center justify-center">
					<button
						class="flex flex-row items-center px-6 py-2 mt-4 bg-neutral text-center text-lightButtonText dark:from-darkBG dark:to-darkBG focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
					>
						<CheckCircleStaticIcon class="h-5 w-5 mr-2" />
						<p class="focus:outline-none">Change Tier</p>
					</button>
				</div>
				<p v-if="store.$state.id" class="text-sm mt-8 text-center text-gray5 dark:text-gray3">
					Manage my <router-link to="/subscriptions" class="text-neutral text">subscriptions</router-link>
				</p>
			</div>
		</div>
	</article>
	<Teleport to="body">
		<SubscriptionsPopup
			v-if="showSubscription"
			:is-subscribed="false"
			:author="profile"
			:author-avatar="profile.avatar"
			:enabled-tiers="props.enabledTiers"
			@close="showSubscription = false"
		/>
		<ChangeTierPopup
			v-if="showChangeTier && activeSub"
			:author="profile"
			:author-avatar="profile.avatar"
			:enabled-tiers="props.enabledTiers"
			:sub="activeSub"
		/>
	</Teleport>
</template>
