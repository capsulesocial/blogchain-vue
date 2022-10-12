<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PremiumSwitch from '@/components/PremiumSwitch.vue';
import { useDraftStore } from '@/store/drafts';
import { toastError } from '@/plugins/toast';
import { usePaymentsStore } from '@/store/paymentProfile';
import { useStore } from '@/store/session';
import TierAccess from '@/components/subscriptions/TierAccess.vue';

const store = useStore();
const draftStore = useDraftStore();
const paymentStore = usePaymentsStore();
const encrypted = computed(() => draftStore.drafts[draftStore.activeIndex].encrypted);
const paymentProfile = computed(() => paymentStore.paymentProfile(store.$state.id));

const showTierAccess = ref(false);

function toggleEncrypted() {
	const postImages = draftStore.drafts[draftStore.activeIndex].postImages;
	if (postImages && postImages.length > 0) {
		toastError(`Encrypted image mismatch. Please remove the images, toggle the premium status, and re-upload.`);
		return;
	}
	draftStore.toggleEncrypted();
	if (encrypted.value) {
		showTierAccess.value = true;
	}
}
onMounted(async () => {
	await paymentStore.fetchPaymentProfile(store.$state.id);
});
</script>
<template>
	<!-- check if user has activated his premium profile to display this one -->
	<article
		v-if="paymentProfile.paymentsEnabled"
		class="bg-lightBG dark:bg-darkBGStop border-lightBorder mb-5 rounded-lg border p-6 py-5 shadow-lg"
	>
		<div class="flex flex-row justify-between items-center">
			<div class="flex flex-col items-start">
				<p class="text-gray5 dark:text-gray3 text-sm">This post is for subscribers only</p>
				<button
					class="text-neutral text-sm mt-1"
					:class="encrypted ? `` : `opacity-50 cursor-not-allowed`"
					:disabled="!encrypted"
					@click="showTierAccess = true"
				>
					Manage access
				</button>
			</div>
			<PremiumSwitch :enabled="encrypted" @toggle="toggleEncrypted" />
		</div>
	</article>
	<Teleport v-if="showTierAccess" to="#popup"> <TierAccess @close="showTierAccess = false" /> </Teleport>
</template>
