<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store/session';
import { useProfilesStore } from '@/store/profiles';
import { usePaymentsStore } from '@/store/paymentProfile';
import { SubscriptionTier } from '@/store/paymentProfile';

import CheckCircleStaticIcon from '@/components/icons/CheckCircleStaticIcon.vue';

const store = useStore();
const profilesStore = useProfilesStore();
const paymentStore = usePaymentsStore();

const props = defineProps({
	id: { type: String, required: true },
	hasfeaturedphoto: { type: Boolean, required: true },
	subscriptionstatus: { type: String, required: true },
	enabledtiers: { type: Array<string>, required: true },
});

const profile = computed(() => profilesStore.getProfile(props.id));
const enabledTierNames = ref<Array<string>>([]);
const toPreSelectTiers = ref<Array<SubscriptionTier>>([]);

onMounted(async () => {
	void profilesStore.fetchProfile(props.id);
	getTiers();
});

async function getTiers() {
	//how to access get payment profile in this file?
	const paymentProfile = await paymentStore.getPaymentProfile(profile.value.id);
	const availableTiers = ref<SubscriptionTier[]>([]);
	if (paymentProfile) {
		availableTiers.value = paymentProfile.tiers;
	}
	props.enabledtiers.forEach((tId: any) => {
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
			:class="hasfeaturedphoto ? `sm:mt-36` : `mt-0`"
		>
			<!-- Not a subscriber -->
			<div v-if="props.subscriptionstatus === `NOT_SUBSCRIBED` || !store.$state.id">
				<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">This post is for Paid subscribers</h4>
				<p class="my-4 text-center text-gray5 dark:text-gray3">
					Become a subscriber of
					<span v-if="profile && profile.name !== ``" class="font-semibold text-primary">{{ profile.name }}</span>
					<span v-else class="font-semibold text-primary">@{{ profile.id }}</span> to access
					<br class="hidden lg:block" />
					this post and other subscriber-only content
				</p>
				<div class="flex items-center justify-center">
					<!-- <SubscribeButton
											:toggle-subscription="toggleSubscription"
											:user-is-subscribed="false"
											:enabled-tiers="enabledTiers"
											class="header-profile my-4"
											style="transform: scale(1.2)"
										/> -->
				</div>
				<p v-if="store.$state.id" class="text-sm mt-8 text-center text-gray5 dark:text-gray3">
					Manage my <router-link to="/subscriptions" class="text-neutral text">subscriptions</router-link>
				</p>
			</div>

			<!-- Subscribed, but to a different tier -->
			<div v-if="props.subscriptionstatus === `INSUFFICIENT_TIER`">
				<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">
					Your subscription tier does not include this post
				</h4>
				<p class="my-4 text-center text-gray5 dark:text-gray3">
					Subscribe to the
					<span v-for="(tier, index) in enabledTierNames.slice(0, 1)" :key="index" class="text-neutral font-semibold">{{
						tier
					}}</span>
					tier of
					<span v-if="profile && profile.name !== ``" class="font-semibold text-primary">{{ profile.name }}</span>
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
</template>
