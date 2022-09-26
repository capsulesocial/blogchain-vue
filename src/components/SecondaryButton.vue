<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		text?: string;
		thin?: boolean;
		action?: () => void;
	}>(),
	{
		action: () => {},
		text: `Text`,
		thin: false,
		action: () => {
			return null;
		},
	},
);

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
		@click.stop="props.action"
	>
		<span class="font-sans" style="font-size: 0.95rem">
			{{ text }}
		</span>
	</button>
</template>
