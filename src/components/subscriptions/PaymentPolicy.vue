<script setup lang="ts">
import { useSubscriptionStore } from '@/store/subscriptions';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
const useSubscription = useSubscriptionStore();
</script>
<template>
	<div>
		<!-- back button -->
		<button class="flex items-center mb-4" @click.stop="useSubscription.$state.step = 2">
			<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
				<ChevronLeft />
			</div>
			<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px">Payments</span>
		</button>
		<!-- Page title -->
		<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl xl:text-3xl font-semibold">
			Renewal, Refund &amp; Cancellation Policy
		</h1>
		<h2 class="text-primary mb-2 mt-4 text-lg font-semibold">
			Blogchain provides a platform for authors to be paid directly by readers. Blogchain will not refund on behalf of
			authors. Authors can issue refunds to readers at their discretion.
		</h2>
		<article class="message w-full">
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">
				How do I request a refund on my subscription?
			</h2>
			<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
				Refunds are issued at the discretion of the Author. Please contact them directly.
			</p>
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold py-2">Important note:</h2>
			<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
				Subscription refunds from the author will not revoke access to your “subscribers only” posts for the current
				month.
			</p>
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">Cancellation Policy</h2>
			<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
				In the event of a subscription cancellation by the author or subscribed reader, the subscription will cancel at
				the period's end. Subscription cancellation will stop the auto-renewal of readers' subscriptions. The reader
				will still have access to content under that subscription until the end of the month of the cancellation.
			</p>
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">Renewal Policy</h2>
			<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
				Reader’s subscription will auto-renew with existing price plans based on monthly or yearly subscription dates.
				Subscribed reader’s will receive an email notification from Stripe for each subscription immediately after the
				renewal payment has been fully processed.
			</p>
		</article>
	</div>
</template>
