<script setup lang="ts">
defineProps({
	image: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(['close']);
function closePopup(): void {
	emit(`close`);
}
</script>

<template>
	<!-- Photo popup -->
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-40 h-screen w-full bg-opacity-50 items-center flex justify-center dark:bg-opacity-50 pt-24"
		@click="closePopup"
	>
		<img :src="image" class="modal-content rounded-lg" />
	</div>
</template>
