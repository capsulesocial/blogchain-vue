<script setup lang="ts">
import IpfsImage from '@/components/IpfsImage.vue';

import XIcon from '@/components/icons/XIcon.vue';
const props = withDefaults(
	defineProps<{
		featuredphotocid: string;
		featuredphotocaption: string;
	}>(),
	{},
);
defineEmits(['close']);
</script>

<template>
	<Teleport to="#popup">
		<div
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 h-screen w-full flex flex-col justify-center items-center pt-16 bg-opacity-50 dark:bg-opacity-50"
			@click.stop="$emit(`close`)"
		>
			<!-- Container -->
			<button class="bg-gray1 dark:bg-gray5 focus:outline-none mb-5 rounded-full p-1" @click="$emit(`close`)">
				<XIcon />
			</button>
			<IpfsImage class="modal-content max-w-3/5 h-auto rounded-lg overflow-hidden" :cid="props.featuredphotocid" />
			<div class="flex justify-center mt-5">
				<p
					v-if="props.featuredphotocaption"
					id="caption"
					class="text-lightPrimaryText dark:text-darkPrimaryText py-2 px-3 text-center bg-lightBG dark:bg-darkBG rounded-lg shadow-lg"
				>
					{{ props.featuredphotocaption }}
				</p>
			</div>
		</div>
	</Teleport>
</template>
<style>
.modal-content {
	display: block;
	max-width: 100%;
	height: auto;
	max-height: 80%;
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
