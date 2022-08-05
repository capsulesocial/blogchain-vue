<template>
	<button v-if="!props.noClick" class="focus:outline-none" @click="$router.push('/id/' + props.authorid)">
		<img
			v-if="props.avatar !== `` && props.avatar !== null"
			:src="props.avatar"
			class="border border-lightBorder dark:border-darkBorder rounded-lg object-cover"
			:class="props.size"
		/>
		<img
			v-else
			:src="avatarList[usernameToPicture(props.authorid)]"
			class="border border-lightBorder dark:border-darkBorder rounded-lg object-cover"
			:class="props.size"
		/>
	</button>
	<span v-else>
		<img
			v-if="props.avatar !== `` && props.avatar !== null"
			:src="props.avatar"
			class="border border-lightBorder dark:border-darkBorder rounded-lg object-cover"
			:class="props.size"
		/>
		<img
			v-else
			:src="avatarList[usernameToPicture(props.authorid)]"
			class="border border-lightBorder dark:border-darkBorder rounded-lg object-cover"
			:class="props.size"
		/>
	</span>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { avatars } from './../config/avatars';

const props = defineProps({
	avatar: { type: String as PropType<string | undefined>, required: true },
	authorid: { type: String, default: `` },
	size: { type: String, default: `w-10 h-10` },
	noClick: { type: Boolean, default: false },
});

const avatarList = ref<Array<undefined>>(avatars);

function usernameToPicture(username: string, buckets = 11): number {
	let x = 0;
	for (let i = 0; i < username.length; i++) {
		x += username.charCodeAt(i);
	}
	const v = ((Math.sin(x) + 1) * (buckets - 1)) / 2;
	return Math.floor(v);
}
</script>
