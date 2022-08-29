<script setup lang="ts">
import { ref } from 'vue';
import HorizontalSubscriptionPreview from '@/components/HorizontalSubscriptionPreview.vue';

// const subscription = ref<ISubscriptionWithProfile>(props.subscription);
const expiredSubscriptions = ref<
	{
		subscriptionId: string;
		authorID: string;
		name: string;
		avatar: string;
		monthsSubbed: number;
		currency: string;
		tier: { name: string; id: string };
	}[]
>([
	{
		subscriptionId: `efeagqgqeggbwrrfqqeg`,
		authorID: `nairobi`,
		name: `Dummy 1`,
		avatar: `QmfM1v8QCadVaLT5SWDpC3Uj2F8zofzcnZYmtvx1VxyY7q`,
		monthsSubbed: 2,
		currency: `eur`,
		tier: { name: `Tier 1`, id: `aeufhahfhabbfefa` },
	},
	{
		subscriptionId: `ouahefhaofoabouehoue`,
		authorID: `tester94384`,
		name: `Dummy 2`,
		avatar: ``,
		monthsSubbed: 4,
		currency: `eur`,
		tier: { name: `Gold tier`, id: `aefjugqgiviyefyiq` },
	},
]);
</script>

<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border py-4 px-6 shadow-lg"
	>
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">Expired subscriptions</h3>
		<div v-if="expiredSubscriptions.length > 0">
			<HorizontalSubscriptionPreview
				v-for="subscription in expiredSubscriptions"
				:key="subscription.subscriptionId"
				:subscription="subscription"
			/>
		</div>
		<p v-else class="text-gray5 dark:text-gray3 text-sm pb-1 mt-2">you have no expired subscriptions</p>
	</div>
</template>
