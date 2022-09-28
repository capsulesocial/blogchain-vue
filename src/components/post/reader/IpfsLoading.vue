<script setup lang="ts">
import ipfs from '@capsulesocial/ipfs-wrapper';
import { onMounted, ref } from 'vue';

const loadingIPFS = ref(true);
const initIPFS = ref(false);
const startIPFS = ref(false);
const initNodes = ref(false);

withDefaults(defineProps<{ hasFeaturedPhoto?: boolean; contentLoader: boolean }>(), { hasFeaturedPhoto: false });

function updateLoop() {
	setTimeout(async () => {
		const res = await update();
		if (!res) {
			updateLoop();
		}
	}, 1000);
}
async function update() {
	const nodesNumber = await ipfs().getNodes();
	if (initNodes.value && nodesNumber !== 0) {
		initNodes.value = false;
		return true;
	}

	return false;
}

onMounted(async () => {
	await ipfs().loadingResult;
	loadingIPFS.value = false;
	initIPFS.value = true;
	await ipfs().initResult;
	startIPFS.value = true;
	initIPFS.value = false;
	initNodes.value = false;
	ipfs().startResult.then(async () => {
		startIPFS.value = false;
		initIPFS.value = false;
		loadingIPFS.value = false;
		initNodes.value = true;
		await update();
		updateLoop();
	});
});
</script>

<template>
	<div v-if="!contentLoader">
		<div
			v-if="hasFeaturedPhoto"
			class="h-72 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6 flex justify-center items-center mt-6"
		>
			<div class="flex items-center">
				<span v-if="loadingIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">Loading IPFS...</span>
				<span v-else-if="initIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
					>Initialising IPFS...</span
				>
				<span v-else-if="startIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
					>Starting IPFS...</span
				>
				<span v-if="loadingIPFS || initIPFS || startIPFS" class="ml-1 flex h-3 w-3 modal-animation">
					<span class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"></span>
					<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
				</span>
			</div>
		</div>
		<div v-else-if="loadingIPFS || initIPFS || startIPFS" class="mt-6">
			<div class="flex items-center">
				<span v-if="loadingIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">Loading IPFS...</span>
				<span v-else-if="initIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
					>Initialising IPFS...</span
				>
				<span v-else-if="startIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
					>Starting IPFS...</span
				>
				<span v-if="loadingIPFS || initIPFS || startIPFS" class="ml-1 flex h-3 w-3 modal-animation">
					<span class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"></span>
					<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
				</span>
			</div>
		</div>
	</div>
	<div v-else>
		<div v-if="initNodes && !loadingIPFS && !initIPFS && !startIPFS" class="mb-6">
			<div class="flex items-center">
				<span class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">Connecting to peers...</span>
				<span class="ml-1 flex h-3 w-3 modal-animation">
					<span class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"></span>
					<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
				</span>
			</div>
		</div>
	</div>
</template>
