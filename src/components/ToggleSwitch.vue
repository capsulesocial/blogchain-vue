<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	period: {
		type: String,
		default: `month`,
	},
});

const active = ref<boolean>(false);
const emit = defineEmits([`toggle`]);

// methods
function toggleSwitch() {
	active.value = !active.value;
	emit(`toggle`);
}
</script>
<template>
	<div
		class="relative w-48 h-8 transition duration-500 ease-in-out rounded-full cursor-pointer bg-neutral flex justify-between items-center"
		@click.stop.prevent="toggleSwitch"
	>
		<div class="absolute left-0 z-10 flex justify-between items-center w-full">
			<p
				class="px-4 transition duration-300 ease-in-out"
				:class="
					props.period === `month` ? `text-gray5 dark:text-gray3` : `text-darkPrimaryText dark:text-lightPrimaryText`
				"
			>
				Monthly
			</p>
			<p
				class="px-6 transition duration-300 ease-in-out"
				:class="
					props.period === `year` ? `text-gray5 dark:text-gray3` : `text-darkPrimaryText dark:text-lightPrimaryText`
				"
			>
				Yearly
			</p>
		</div>
		<label
			class="absolute left-0 z-0 w-24 h-8 transition duration-300 ease-in-out transform bg-lightBG dark:bg-darkBG border-neutral border-2 rounded-full flex justify-center items-center text-sm"
			:class="[active ? 'translate-x-full' : 'translate-x-0']"
		>
		</label>
		<input type="checkbox" class="w-full h-full appearance-none focus:outline-none" />
	</div>
</template>
