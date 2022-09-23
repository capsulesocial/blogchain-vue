<script setup lang="ts">
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
import { SubscriptionTier } from '@/store/paymentProfile';

const props = withDefaults(
	defineProps<{
		selectedTier: SubscriptionTier;
		isLoading?: boolean;
		text: string;
		toEmit: string;
	}>(),
	{},
);
</script>
<template>
	<div>
		<button
			:class="props.selectedTier !== null ? `` : `opacity-50 cursor-not-allowed`"
			class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
			style="padding: 0.4rem 1.5rem"
			:disabled="props.selectedTier === null"
			@click="$emit(`${props.toEmit}`)"
		>
			<SpinnerIcon v-if="props.isLoading" class="mx-2 p-1" />
			<span v-else class="font-sans" style="font-size: 0.95rem">{{ props.text }} </span>
		</button>
	</div>
</template>
