<script setup lang="ts">
withDefaults(
	defineProps<{
		isActive?: boolean;
	}>(),
	{
		isActive: false,
	},
);
</script>

<template>
	<span
		:class="
			isActive
				? `text-primary fill-primary stroke-primary`
				: `text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary`
		"
	>
		<svg
			v-if="!isActive"
			xmlns="http://www.w3.org/2000/svg"
			width="25"
			height="25"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
		>
			<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
		</svg>

		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 25 25"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="1.6"
		>
			<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
		</svg>
	</span>
</template>
