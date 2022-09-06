<template>
	<button v-if="!props.noClick" class="focus:outline-none" @click="$router.push('/id/' + props.authorid)">
		<img
			v-lazy="{ src: imageSrc ?? avatarList[usernameToPicture(props.authorid)] }"
			class="border border-lightBorder dark:border-darkBorder rounded-lg object-cover"
			:class="props.size"
		/>
	</button>
	<span v-else>
		<img
			v-lazy="{ src: imageSrc ?? avatarList[usernameToPicture(props.authorid)] }"
			class="border border-lightBorder dark:border-darkBorder rounded-lg object-cover"
			:class="props.size"
		/>
	</span>
</template>

<script setup lang="ts">
import { getPhotoFromIPFS } from '@/backend/getPhoto';
import { onMounted, PropType, ref } from 'vue';
import { avatars } from './../config/avatars';

const imageSrc = ref<string>();

const props = defineProps({
	avatar: { type: String as PropType<string | undefined>, default: undefined },
	cid: { type: String as PropType<string | undefined>, default: undefined },
	authorid: { type: String, default: `` },
	size: { type: String, default: `w-10 h-10` },
	noClick: { type: Boolean, default: false },
});

onMounted(async () => {
	if (props.avatar) {
		imageSrc.value = await getPhotoFromIPFS(props.avatar);
	} else if (props.cid) {
		imageSrc.value = await getPhotoFromIPFS(props.cid);
	}
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
