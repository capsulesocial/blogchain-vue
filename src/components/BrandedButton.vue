<script setup lang="ts">
import { toRefs } from 'vue'
import SpinnerIcon from './icons/SpinnerIcon.vue'

const props = defineProps({
	text: { type: String, required: true },
	action: {
		type: Function,
		default: () => {
			console.log(`button clicked with no action passed as prop!`)
		},
	},
	loading: Boolean,
})

function triggerAction() {
	props.action()
}
const { text } = toRefs(props)
</script>

<template>
	<button
		style="padding: 0.6rem 1.7rem"
		class="bg-primary text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
		@click="triggerAction()"
	>
		<span v-show="!loading" class="font-sans" style="font-size: 0.95rem">
			{{ text }}
		</span>
		<SpinnerIcon v-show="loading" style="padding: 0.2em" />
	</button>
</template>
