<script setup lang="ts">
import IpfsImage from '@/components/IpfsImage.vue';

import XIcon from '@/components/icons/XIcon.vue';
const props = withDefaults(
	defineProps<{
		image: string;
	}>(),
	{},
);

defineEmits(['close']);
</script>

<template>
	<!-- Photo popup -->
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 h-screen w-full flex flex-col justify-center items-center pt-16 bg-opacity-50 dark:bg-opacity-50"
		@click.stop="$emit(`close`)"
	>
		<button class="bg-gray1 dark:bg-gray5 focus:outline-none mb-5 rounded-full p-1" @click="$emit(`close`)">
			<XIcon />
		</button>
		<IpfsImage
			class="modal-content rounded-lg overflow-hidden w-2/5"
			:cid="props.image"
			:img-class="`object-contain`"
		/>
	</div>
</template>
