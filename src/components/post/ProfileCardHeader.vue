<script setup lang="ts">
withDefaults(
	defineProps<{
		authorID: string;
		authorName: string;
		isHoverCard?: boolean;
	}>(),
	{
		isHoverCard: false,
	},
);
</script>
<template>
	<router-link :to="'/id/' + authorID" class="mr-4 flex" :class="isHoverCard ? `flex-col` : ``">
		<span
			v-if="authorName != ``"
			class="text-base dark:text-darkPrimaryText transition ease-in-out hover:underline"
			:class="isHoverCard ? `font-bold` : `font-medium`"
		>
			{{ authorName }}
		</span>
		<span
			v-else
			class="text-gray5 dark:text-gray3 text-base transition ease-in-out hover:underline"
			:class="isHoverCard ? `font-bold` : `font-medium`"
		>
			{{ authorID }}
		</span>
		<span class="text-gray5 dark:text-gray3" :class="isHoverCard ? `` : `ml-2`"> @{{ authorID }} </span>
	</router-link>
</template>
