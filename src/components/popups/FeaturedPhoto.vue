<script setup lang="ts">
import XIcon from '@/components/icons/XIcon.vue';

const prop = defineProps({
	featuredPhoto: {
		type: Object,
		required: true,
	},
});

console.log(prop.featuredPhoto.photo);
console.log(prop.featuredPhoto.caption);
defineEmits(['close']);
</script>
<template>
	<div
		class="bg-darkBG dark:bg-lightBG fixed z-40 h-screen w-full overflow-auto bg-opacity-50 dark:bg-opacity-50 pt-16 flex flex-col justify-center items-center"
		@click.stop="$emit(`close`)"
	>
		<button class="bg-gray1 dark:bg-gray5 focus:outline-none mb-5 rounded-full p-1" @click="$emit(`close`)">
			<XIcon />
		</button>
		<img :src="prop.featuredPhoto.photo" class="modal-content max-w-3/5 h-auto rounded-lg" />
		<div class="flex justify-center mt-5">
			<p
				v-if="featuredPhoto.caption"
				id="caption"
				class="text-lightPrimaryText dark:text-darkPrimaryText py-2 px-3 text-center bg-lightBG dark:bg-darkBG rounded-lg shadow-lg"
			>
				{{ featuredPhoto.caption }}
			</p>
		</div>
	</div>
</template>
<style>
.modal-content {
	display: block;
	max-width: 100%;
	height: auto;
	max-height: 88%;
}
/* Add Animation */
.modal-content,
#caption {
	animation-name: zoom;
	animation-duration: 0.6s;
}
@keyframes zoom {
	from {
		transform: scale(0.7);
	}
	to {
		transform: scale(1);
	}
}
</style>
