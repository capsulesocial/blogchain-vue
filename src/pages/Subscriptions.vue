<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import SubscriptionPreview from '@/components/SubscriptionPreview.vue';
// import { ISubscriptionWithProfile } from '@/store/subscriptions';

const store = useStore();
const settings = useStoreSettings();

// const subscription = ref<ISubscriptionWithProfile>(props.subscription);
const subscriptions = ref<
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
	<div class="px-5 pt-3 pb-3 xl:px-6 xl:pt-4">
		<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold xl:text-xl">My subscriptions</h2>
		<p class="text-gray5 dark:text-gray3">Here you can manage your active subscriptions to your favorite authors</p>
	</div>
	<article
		id="scrollable_content"
		class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 w-full overflow-y-auto px-5 sm:px-4 xl:px-5 pt-2 lg:overflow-y-hidden relative"
	>
		<div v-if="subscriptions.length > 0" class="flex flex-wrap items-start">
			<SubscriptionPreview
				v-for="subscription in subscriptions"
				:key="subscription.subscriptionId"
				:subscription="subscription"
			/>
		</div>
		<div v-else>
			<div v-if="store.$state.id !== ``" class="flex flex-col items-center">
				<p class="text-gray5 dark:text-gray3 align-end mb-1 mt-6 flex items-end text-sm w-3/4 text-center">
					It seems like you don't currently have any active subscriptions. Browse Blogchain and subscribe to authors to
					view them here
				</p>
				<img
					:src="
						require(settings.isDarkMode
							? `@/assets/images/brand/dark/subscriptions.webp`
							: `@/assets/images/brand/light/subscriptions.webp`)
					"
					class="h-auto"
					loading="lazy"
				/>
			</div>
		</div>
	</article>
</template>
