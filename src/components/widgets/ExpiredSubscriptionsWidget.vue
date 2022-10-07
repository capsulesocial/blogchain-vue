<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSubscriptionStore } from '@/store/subscriptions';
import HorizontalSubscriptionPreview from '@/components/HorizontalSubscriptionPreview.vue';

const subStore = useSubscriptionStore();
const expiredSubscriptions = ref();

onMounted(() => {
	expiredSubscriptions.value = subStore.$state.inActive;
});
</script>

<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border py-4 px-6 shadow-lg"
	>
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">Expired subscriptions</h3>
		<div v-if="expiredSubscriptions?.length > 0">
			<HorizontalSubscriptionPreview
				v-for="subscription in expiredSubscriptions"
				:key="subscription.subscriptionId"
				:subscription="subscription"
			/>
		</div>
		<p v-else class="text-gray5 dark:text-gray3 text-sm pb-1 mt-2">You have no expired subscriptions</p>
	</div>
</template>
