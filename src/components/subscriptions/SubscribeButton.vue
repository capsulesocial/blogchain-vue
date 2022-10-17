<script setup lang="ts">
import CrownIcon from '@/components/icons/CrownIcon.vue';
import PenIcon from '@/components/icons/Pencil.vue';

const props = withDefaults(
	defineProps<{
		isSubscribed: boolean;
		action: () => void;
	}>(),
	{
		action: () => {},
		isSubscribed: false,
	},
);
</script>

<template>
	<button class="focus:outline-none block rounded-lg">
		<div v-if="props.isSubscribed">
			<!-- Desktop -->
			<div
				class="friendbtn text-grey5 hidden rounded-lg bg-white px-5 text-sm font-semibold text-neutral shadow-sm border border-lightBorder transition duration-300 ease-in-out hover:text-primary hover:border-primary xl:block"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				@click="props.action"
			>
				<span class="following">Subscribed</span>

				<span class="unfollow" style="padding-right: 1.53rem; padding-left: 1.53rem">Edit</span>
			</div>
			<!-- Mobile -->
			<div
				class="friendbtn dark:bg-darkBG text-primary rounded-lg p-1 shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
				@click="props.action"
			>
				<PenIcon class="m-1 h-5 w-5" />
			</div>
		</div>
		<div v-else>
			<!-- Desktop -->
			<div
				class="bg-neutral hover:bg-opacity-75 hidden rounded-lg px-5 text-sm font-semibold text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:flex flex-row items-center"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
				@click="props.action"
			>
				<p class="self-center">Subscribe</p>
				<CrownIcon class="ml-2 h-4 w-4 self-center" />
			</div>
			<!-- Mobile -->
			<div
				class="bg-neutral rounded-lg p-1 text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
				@click="props.action"
			>
				<CrownIcon class="m-1 h-5 w-5" />
			</div>
		</div>
	</button>
</template>

<style scoped>
div.friendbtn span.following {
	display: block;
}
div.friendbtn:hover span.following {
	display: none;
}
div.friendbtn span.unfollow {
	display: none;
}
div.friendbtn:hover span.unfollow {
	display: block;
}
</style>
