<script setup lang="ts">
import CloseIcon from '../components/icons/CloseIcon.vue';
</script>
<template>
	<main class="w-full flex flex-col items-center pt-10">
		<section class="lg:w-760 lg:max-w-760 mt-10">
			<!-- Page title -->
			<article class="px-4 py-4 xl:px-6 xl:py-5">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold xl:text-4xl">
					Renewal, Refund &amp; Cancellation Policy
				</h1>
			</article>
			<div class="container px-4 pb-6 xl:px-6">
				<h2 class="text-primary mb-6 mt-4 text-xl font-semibold">
					Blogchain provides a platform for authors to be paid directly by readers. Blogchain will not refund on behalf
					of authors. Authors can issue refunds to readers at their discretion.
				</h2>
				<article class="message mb-4 w-full">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-h2 font-semibold py-2">
						How do I request a refund on my subscription?
					</h2>
					<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
						Refunds are issued at the discretion of the Author. Please contact them directly.
					</p>
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-h3 font-semibold py-2">Important note:</h2>
					<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
						Subscription refunds from the author will not revoke access to your “subscribers only” posts for the current
						month.
					</p>
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-h2 font-semibold py-2">
						Cancellation Policy
					</h2>
					<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
						In the event of a subscription cancellation by the author or subscribed reader, the subscription will cancel
						at the period's end. Subscription cancellation will stop the auto-renewal of readers' subscriptions. The
						reader will still have access to content under that subscription until the end of the month of the
						cancellation.
					</p>
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-h2 font-semibold py-2">Renewal Policy</h2>
					<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
						Reader’s subscription will auto-renew with existing price plans based on monthly or yearly subscription
						dates. Subscribed reader’s will receive an email notification from Stripe for each subscription immediately
						after the renewal payment has been fully processed.
					</p>
				</article>
			</div>
			<div class="flex justify-center">
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1 mb-20" @click="$router.go(-1)">
					<CloseIcon />
				</button>
			</div>
		</section>
	</main>
</template>
