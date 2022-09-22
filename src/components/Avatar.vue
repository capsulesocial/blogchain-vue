<script setup lang="ts">
import { PropType, ref } from 'vue';
import { avatars } from './../config/avatars';
import IpfsImage from './IpfsImage.vue';

const props = defineProps({
	override: { type: String as PropType<string | null | ArrayBuffer>, default: null },
	cid: { type: String as PropType<string | null>, default: null },
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

<template>
	<button v-if="!props.noClick" class="focus:outline-none" @click="$router.push('/id/' + props.authorid)">
		<img
			v-if="override"
			v-lazy="override"
			class="border border-lightBorder dark:border-darkBorder rounded-lg"
			:class="props.size"
		/>
		<IpfsImage
			v-else
			:cid="cid"
			:default-image="avatarList[usernameToPicture(props.authorid)]"
			:img-class="'border border-lightBorder dark:border-darkBorder rounded-lg ' + props.size"
		/>
	</button>
	<span v-else>
		<img
			v-if="override"
			v-lazy="override"
			class="border border-lightBorder dark:border-darkBorder rounded-lg"
			:class="props.size"
		/>
		<IpfsImage
			v-else
			:cid="cid"
			:default-image="avatarList[usernameToPicture(props.authorid)]"
			:img-class="'border border-lightBorder dark:border-darkBorder rounded-lg ' + props.size"
		/>
	</span>
</template>
