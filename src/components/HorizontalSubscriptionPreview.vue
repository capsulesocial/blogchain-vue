<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfilesStore } from '@/store/profiles';
import { ISubscriptionWithProfile } from '@/store/subscriptions';

import Avatar from '@/components/Avatar.vue';
import SubscribeButton from '@/components/subscriptions/SubscribeButton.vue';
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue';

const profilesStore = useProfilesStore();

const props = withDefaults(
	defineProps<{
		subscription: ISubscriptionWithProfile;
	}>(),
	{},
);

const showSubscription = ref<boolean>(false);
const profile = computed(() => profilesStore.getProfile(props.subscription.authorID));

onMounted(async () => {
	profilesStore.fetchProfile(props.subscription.authorID);
});
</script>

<template>
	<div class="w-full flex flex-row justify-between mt-4 mb-1">
		<div class="flex flex-row">
			<!-- Avatar -->
			<Avatar
				:cid="props.subscription.avatar"
				:authorid="props.subscription.authorID"
				:size="`w-12 h-12 xl:w-14 xl:h-14`"
				class="self-center"
			/>
			<!-- Middle: name and id -->
			<div class="ml-4 self-center">
				<h5 v-if="props.subscription.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText">
					{{ props.subscription.name }}
				</h5>
				<h5 v-else class="text-gray5 dark:text-gray3">
					{{ props.subscription.authorID }}
				</h5>
				<h6 class="text-primary text-sm">@{{ props.subscription.authorID }}</h6>
			</div>
		</div>
		<!-- Renew button -->
		<SubscribeButton
			class="self-center"
			:is-subscribed="false"
			:action="() => (showSubscription = !showSubscription)"
		/>
	</div>
	<Teleport to="body">
		<SubscriptionsPopup
			v-if="showSubscription"
			:is-subscribed="false"
			:author="profile"
			:author-avatar="profile.avatar"
			:enabled-tiers="[]"
			@close="showSubscription = false"
		/>
	</Teleport>
</template>
