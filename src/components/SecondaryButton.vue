<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
	text: {
		type: String,
		default: `Text`,
	},
	thin: {
		type: Boolean,
		default: false,
	},
	action: {
		type: Function,
		default() {
			return null
		},
	},
})

function getStyles(): string {
	const res = ref(``)
	if (!props.thin) {
		res.value += ` py-3 px-6`
	} else {
		res.value += ` py-1 px-4`
	}
	return res
}
</script>

<template>
	<button
		style="padding: 0.4rem 1.5rem"
		:class="getStyles()"
		class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
		@click="action()"
	>
		<span class="font-sans" style="font-size: 0.95rem">
			{{ text }}
		</span>
	</button>
</template>
