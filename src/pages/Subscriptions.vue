<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useMeta } from 'vue-meta';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { useSubscriptionStore, ISubscriptionWithProfile } from '@/store/subscriptions';

import SubscriptionPreview from '@/components/subscriptions/SubscriptionPreview.vue';
import SubInfosPopup from '@/components/popups/SubInfosPopup.vue';
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue';
import { createDefaultProfile } from '@/backend/profile';

const isLoading = ref(true);
const store = useStore();
const settings = useStoreSettings();
const subStore = useSubscriptionStore();

const subscriptions = computed(() => subStore.$state.active);
const toggleSubInfoPopup = ref(false);
const subscriptionInfo = ref();
const showChangeTier = ref(false);
const subscriptionProfile = ref(createDefaultProfile(store.$state.id));
const subscriptionProfileAvatar = ref<string | undefined>();
const authorPaymentProfile = ref<ISubscriptionWithProfile | undefined>();

useMeta({
	title: `Active Subscriptions - Blogchain`,
	htmlAttrs: { lang: 'en', amp: true },
});

function showSubInfoPopup(subscription: any) {
	toggleSubInfoPopup.value = true;
	subscriptionInfo.value = subscription;
}

function toggleChangeTierPopup(author: { sub: ISubscriptionWithProfile; avatar: string }) {
	subscriptionProfile.value = createDefaultProfile(author.sub.authorID);
	subscriptionProfileAvatar.value = author.avatar;
	authorPaymentProfile.value = author.sub;
	showChangeTier.value = !showChangeTier.value;
}

onBeforeMount(async () => {
	await subStore.fetchSubs(store.$state.id);
	isLoading.value = false;
});
</script>
<template>
	<div>
		<div class="px-5 pt-3 pb-3 xl:px-6 xl:pt-4">
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-lg font-semibold xl:text-xl">My subscriptions</h2>
			<p class="text-gray5 dark:text-gray3">Here you can manage your active subscriptions to your favorite authors</p>
		</div>
		<article
			id="scrollable_content"
			class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 w-full overflow-y-auto px-5 sm:px-4 xl:px-5 pt-2 lg:overflow-y-hidden relative"
		>
			<div v-if="!isLoading && subscriptions.length > 0 && store.$state.id !== ``" class="flex flex-wrap items-start">
				<SubscriptionPreview
					v-for="subscription in subscriptions"
					:key="subscription.subscriptionId"
					:subscription="subscription"
					@sub-info-popup="showSubInfoPopup(subscription)"
				/>
			</div>
			<div v-else class="modal-animation flex w-full justify-center z-20 mt-24">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</div>

			<div v-if="!isLoading && store.$state.id !== `` && subscriptions.length <= 0">
				<div class="flex flex-col items-center">
					<p class="text-gray5 dark:text-gray3 align-end mb-1 mt-6 flex items-end text-sm w-3/4 text-center">
						It seems like you don't currently have any active subscriptions. Browse Blogchain and subscribe to authors
						to view them here
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
		<div v-if="toggleSubInfoPopup">
			<SubInfosPopup
				:sub="subscriptionInfo"
				@switch-popup="toggleChangeTierPopup"
				@close="toggleSubInfoPopup = false"
			/>
		</div>
		<div v-if="showChangeTier && authorPaymentProfile">
			<ChangeTierPopup
				:author="subscriptionProfile"
				:sub="authorPaymentProfile"
				:author-avatar="subscriptionProfileAvatar"
				@close="showChangeTier = false"
			/>
		</div>
	</div>
</template>
