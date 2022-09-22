<script setup lang="ts">
const props = defineProps({
	text: { type: String, default: `Text` },
	thin: { type: Boolean, default: false },
});

defineEmits([`submitPayment`]);

function getStyles(): string {
	let res = ``;
	if (!props.thin) {
		res += ` py-3 px-6`;
	} else {
		res += ` py-1 px-4`;
	}
	return res;
}
</script>

<template>
	<button
		style="padding: 0.4rem 1.5rem"
		:class="getStyles()"
		class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
		@click.stop="$emit(`submitPayment`)"
	>
		<span class="font-sans" style="font-size: 0.95rem">
			{{ text }}
		</span>
	</button>
</template>
