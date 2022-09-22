<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CrownIcon from '@/components/icons/Crown.vue';
import PenIcon from '@/components/icons/Pencil.vue';
import SubInfosPopup from '@/components/popups/SubInfosPopup.vue';
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue';
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue';
import { useStore } from '@/store/session';
import { useSubscriptionStore, ISubscriptionWithProfile } from '@/store/subscriptions';
import { createDefaultProfile, Profile } from '@/backend/profile';

defineProps({
	userIsSubscribed: {
		type: Boolean,
		required: true,
	},
});

const store = useStore();
const route = useRoute();
const useSubscription = useSubscriptionStore();
const subscriptionInfo = ref();
const toggleSub = ref<boolean>(false);
const toggleChangeTier = ref<boolean>(false);
const showSubscriptionPopup = ref<boolean>(false);
const subscriptionProfile = ref<Profile>(createDefaultProfile(store.$state.id));
const subscriptionProfileAvatar = ref<string | undefined>();
const authorPaymentProfile = ref<ISubscriptionWithProfile>();
const isActiveSub = ref<boolean>(false);

onMounted(async (): Promise<void> => {
	const activeSubs: ISubscriptionWithProfile[] = await useSubscription.$state.active;
	activeSubs.forEach((activeSub: ISubscriptionWithProfile): void => {
		if (activeSub.authorID === (route.params.id as string)) {
			subscriptionInfo.value = activeSub;
			isActiveSub.value = true;
			return;
		}
	});
});

// methods
async function subscribeAuthor(): Promise<void> {
	showSubscriptionPopup.value = !showSubscriptionPopup.value;
	subscriptionProfile.value = createDefaultProfile(route.params.id as string);
	subscriptionProfileAvatar.value = subscriptionProfile.value.avatar;
}
function toggleSubinfo(): void {
	toggleSub.value = !toggleSub.value;
}
async function toggleChangeTierPopup(author: { sub: ISubscriptionWithProfile; avatar: string }): Promise<void> {
	subscriptionProfile.value = createDefaultProfile(author.sub.authorID);
	subscriptionProfileAvatar.value = author.avatar;
	authorPaymentProfile.value = author.sub;
	toggleChangeTier.value = !toggleChangeTier.value;
}
</script>
<template>
	<button class="focus:outline-none block rounded-lg">
		<div v-if="userIsSubscribed">
			<!-- Desktop -->
			<div
				class="friendbtn text-grey5 hidden rounded-lg bg-white px-5 text-sm font-semibold text-neutral shadow-sm border border-lightBorder transition duration-300 ease-in-out hover:text-primary hover:border-primary xl:block"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				@click.stop.prevent="toggleSubinfo"
			>
				<span class="following">Subscribed</span>

				<span class="unfollow" style="padding-right: 1.53rem; padding-left: 1.53rem">Edit</span>
			</div>
			<!-- Mobile -->
			<div
				class="friendbtn dark:bg-darkBG text-primary rounded-lg p-1 shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
				@click.stop.prevent="toggleSubinfo"
			>
				<PenIcon class="m-1 h-5 w-5" />
			</div>
		</div>
		<div v-else>
			<!-- Desktop -->

			<div
				class="bg-neutral hover:bg-opacity-75 hidden rounded-lg px-5 text-sm font-semibold text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:flex flex-row items-center"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				@click.stop.prevent="subscribeAuthor"
			>
				<p class="self-center">Subscribe</p>
				<CrownIcon class="ml-2 h-4 w-4 self-center" />
			</div>
			<!-- Mobile -->
			<div
				class="bg-neutral rounded-lg p-1 text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
				@click.stop.prevent="subscribeAuthor"
			>
				<CrownIcon class="m-1 h-5 w-5" />
			</div>
		</div>
	</button>
	<div v-if="toggleSub">
		<SubInfosPopup :sub="subscriptionInfo" @switch-popup="toggleChangeTierPopup" @close="toggleSub = false" />
	</div>
	<div v-if="toggleChangeTier && authorPaymentProfile">
		<ChangeTierPopup
			:author="subscriptionProfile"
			:sub="authorPaymentProfile"
			:author-avatar="subscriptionProfileAvatar"
			@close="toggleChangeTier = false"
		/>
	</div>
	<div v-if="showSubscriptionPopup">
		<SubscriptionsPopup
			:author="subscriptionProfile"
			:is-subscribed="isActiveSub"
			:author-avatar="subscriptionProfileAvatar"
			@close="showSubscriptionPopup = false"
		/>
	</div>
</template>

<style scoped>
div.friendbtn span.following {
	display: block;
}
div.friendbtn:hover span.following {
	display: none;
}
div.friendbtn span.unfollow {
	display: none;
}
div.friendbtn:hover span.unfollow {
	display: block;
}
</style>
