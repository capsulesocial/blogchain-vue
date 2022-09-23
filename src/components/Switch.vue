<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
	defineProps<{
		enabled?: boolean;
	}>(),
	{},
);

const emit = defineEmits([`toggle`]);

const active = ref<boolean>(props.enabled);

function toggleSwitch() {
	active.value = !active.value;
	emit(`toggle`);
}
</script>

<template>
	<div
		class="relative w-12 h-6 transition duration-500 ease-in-out rounded-full cursor-pointer"
		:class="[active ? 'bg-neutral' : 'bg-gray1 dark:bg-gray7']"
		@click="toggleSwitch"
	>
		<label
			class="absolute left-0 w-6 h-6 mb-2 transition duration-300 ease-in-out transform bg-white border-2 rounded-full"
			:class="[active ? 'translate-x-full border-neutral' : 'translate-x-0 border-gray1 dark:border-gray7']"
		></label>
		<input type="checkbox" class="w-full h-full appearance-none focus:outline-none" />
	</div>
</template>
