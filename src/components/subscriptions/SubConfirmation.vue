<script setup lang="ts">
import FriendButton from '@/components/FriendButton.vue';
import Avatar from '@/components/Avatar.vue';
import CrownIcon from '@/components/icons/CrownIcon.vue';
import { Profile } from '@/backend/profile';
import { darkMode } from '@/plugins/colors';
import { SubscriptionTier } from '@/store/paymentProfile';
import { useConnectionsStore } from '@/store/connections';
import { useStore } from '@/store/session';
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{ author: Profile; selectedTier: SubscriptionTier; toggleFriend: () => void }>(),
	{},
);

const userIsFollowed = computed(() => useConnectionsStore().getFollowStatus(useStore().$state.id, props.author.id));

defineEmits([`startReading`]);
</script>

<template>
	<div>
		<div class="w-full flex flex-col justify-center text-center px-10">
			<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
			<h6 class="font-semibold text-neutral text-xl mb-2">Congrats!</h6>
			<p class="text-base text-center text-gray5 dark:text-gray3 mb-4">You are now subscribed to:</p>
		</div>
		<!-- Premium profile preview -->
		<div class="flex flex-row items-center p-4 border border-neutral rounded-lg w-2/3">
			<Avatar
				class="flex-shrink-0"
				:authorid="props.author.id"
				:cid="props.author.avatar"
				:no-click="true"
				:size="`w-14 h-14`"
			/>
			<div class="flex flex-col ml-4 flex-grow w-3/5">
				<h4 v-if="props.author.name !== ``" class="text-xl font-semibold dark:text-darkPrimaryText">
					{{ props.author.name }}
				</h4>
				<h4 v-else class="text-xl font-semibold text-gray5 dark:text-gray3">
					{{ props.author.id }}
				</h4>
				<h5 class="text-lg text-primary dark:text-secondary w-full overflow-hidden" style="text-overflow: ellipsis">
					@{{ props.author.id }}
				</h5>
			</div>
			<div
				class="bg-neutral bg-opacity-25 rounded-3xl border border-neutral px-3 py-2 text-neutral text-xs mt-2 truncate pl-2"
			>
				{{ props.selectedTier ? props.selectedTier.name : `` }}
			</div>
		</div>
		<div class="w-full flex flex-col justify-center items-center text-center px-10 mt-5">
			<p class="text-base text-center text-gray5 dark:text-gray3 mb-4 max-w-md">
				All premium articles under {{ props.selectedTier ? props.selectedTier.name : `` }} tier<br />
				are now unlocked for your account.
			</p>
			<button
				v-if="userIsFollowed"
				class="px-5 py-2 rounded-lg bg-neutral focus:outline-none text-white mt-6 font-semibold"
				@click.stop="$emit(`startReading`)"
			>
				Start reading
			</button>
			<div v-else class="flex flex-col items-center">
				<p class="text-base text-center text-gray5 dark:text-gray3 mb-4 max-w-md">
					Don't forget to follow this author to see<br />
					their latest posts on your home feed:
				</p>
				<FriendButton :authorid="props.author.id" />
			</div>
		</div>
		<img
			loading="lazy"
			:src="darkMode ? `@/assets/brand/dark/subscriptions.webp` : `@/assets/brand/light/subscriptions.webp`"
			class="h-auto rounded-lg"
		/>
	</div>
</template>
