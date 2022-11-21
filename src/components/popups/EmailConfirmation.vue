<script setup lang="ts">
import CloseIcon from '@/components/icons/XIcon.vue';
import CrownIcon from '@/components/icons/CrownIcon.vue';

import { useStore } from '@/store/session';

const props = withDefaults(
	defineProps<{
		authorName: string;
		emailAddress: string;
	}>(),
	{},
);

const store = useStore();

const emit = defineEmits([`close`]);
</script>
<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<section>
			<div
				class="min-h-40 max-h-90 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation z-10 mr-5 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">Email Confirmation</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div class="flex w-full flex-col items-center mt-10">
					<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
					<h1 class="py-4 text-xl my-2">
						Hey
						<span class="font-semibold text-primary">{{
							store.$state.name !== `` ? store.$state.name : `@${store.$state.id}`
						}}</span>
						you're all setup! 🎉
					</h1>
				</div>
				<div class="flex w-full flex-col-reverse items-center">
					<p class="text-gray5 dark:text-gray3 mb-5 text-center">
						Your email <span class="text-primary font-semibold">{{ props.emailAddress }}</span> has been confirmed and
						you will receive {{ `@${props.authorName}` }}'s new post in your inbox
					</p>
				</div>
			</div>
		</section>
	</div>
</template>
