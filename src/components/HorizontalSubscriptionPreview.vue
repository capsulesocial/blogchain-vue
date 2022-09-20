<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import SubscribeButton from '@/components/SubscribeButton.vue';
import { ISubscriptionWithProfile } from '@/store/subscriptions';
import { PropType } from 'vue';

defineProps({
	subscription: {
		type: Object as PropType<ISubscriptionWithProfile>,
		required: true,
	},
});
</script>

<template>
	<div class="w-full flex flex-row justify-between mt-4 mb-1">
		<div class="flex flex-row">
			<!-- Avatar -->
			<Avatar
				:cid="subscription.avatar"
				:authorid="subscription.authorID"
				:size="`w-12 h-12 xl:w-14 xl:h-14`"
				class="self-center"
			/>
			<!-- Middle: name and id -->
			<div class="ml-4 self-center">
				<h5 v-if="subscription.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText">
					{{ subscription.name }}
				</h5>
				<h5 v-else class="text-gray5 dark:text-gray3">{{ subscription.authorID }}</h5>
				<h6 class="text-primary text-sm">@{{ subscription.authorID }}</h6>
			</div>
		</div>
		<!-- Renew button -->
		<SubscribeButton class="self-center" :user-is-subscribed="false" />
	</div>
</template>
