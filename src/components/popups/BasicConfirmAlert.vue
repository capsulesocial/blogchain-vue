<script setup lang="ts">
import { ref } from 'vue';
import QuestionIcon from '@/components/icons/Question.vue';
defineProps({
	text: {
		type: String,
		required: true,
	},
});

defineEmits(['close', 'confirm']);
const showInfoBubble = ref<boolean>(false);
</script>

<template>
	<div
		class="popup w-full bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 p-5 flex h-full w-full items-center justify-center bg-opacity-25 dark:bg-opacity-25"
		@click.stop="$emit(`close`)"
	>
		<!-- Container -->
		<section>
			<div
				class="w-full bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
			>
				<div class="flex items-center">
					<div @mouseover="showInfoBubble = true" @mouseleave="showInfoBubble = false">
						<QuestionIcon class="mr-4 h-8 w-8 text-gray5 dark:text-gray3" />
					</div>
					<p class="my-4 text-gray5 dark:text-gray3">
						{{ text }}
					</p>
				</div>
				<div class="flex justify-end items-center">
					<button class="text-primary focus:outline-none mr-6" @click="$emit(`close`)">Cancel</button>
					<button
						class="focus:outline-none bg-primary text-lightButtonText transform rounded-lg px-8 py-2 font-bold shadow-lg transition duration-500 ease-in-out"
						@click="$emit(`confirm`)"
					>
						Confirm
					</button>
				</div>
			</div>
		</section>
	</div>
</template>
<style>
.dropdownInfoOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.dropdownInfoOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
	z-index: 1;
}
</style>
