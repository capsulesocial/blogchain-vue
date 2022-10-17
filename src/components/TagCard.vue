<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		tag: string;
		noClick: boolean;
	}>(),
	{
		noClick: false,
	},
);
</script>

<template>
	<button
		class="focus:outline-none bg-gray1 dark:bg-gray7 z-10 transform rounded-lg px-3 pb-1 transition duration-500 ease-in-out"
		:disabled="props.noClick"
		@click="props.noClick ? `` : $router.push('/tag/' + props.tag)"
	>
		<span class="text-gray5 dark:text-gray1 text-sm"> {{ props.tag }} </span>
	</button>
</template>
