<script setup lang="ts">
import ipfs from '@capsulesocial/ipfs-wrapper';
import { onMounted, ref } from 'vue';
import { useStoreSettings } from '../store/settings';

import CapsuleIcon from './icons/CapsuleIcon.vue';

const settings = useStoreSettings();
const showInfo = ref(false);
const loadingIPFS = ref(true);
const initIPFS = ref(false);
const startIPFS = ref(false);
const initNodes = ref(false);
const nodes = ref(0);

function updateLoop() {
	setTimeout(async () => {
		await update();
		updateLoop();
	}, 1000);
}
async function update() {
	const nodesNumber = await ipfs().getNodes();
	nodes.value = nodesNumber;
	if (initNodes.value && nodesNumber !== 0) {
		initNodes.value = false;
	}
}

onMounted(async () => {
	await ipfs().loadingResult;
	loadingIPFS.value = false;
	initIPFS.value = true;
	await ipfs().initResult;
	startIPFS.value = true;
	initIPFS.value = false;
	ipfs().startResult.then(async () => {
		startIPFS.value = false;
		initIPFS.value = false;
		loadingIPFS.value = false;
		await update();
		updateLoop();
	});
});
</script>

<template>
	<div class="relative">
		<!-- Peered nodes -->
		<div
			class="bg-gray1 dark:bg-gray7 items-center rounded-lg px-3 flex h-9"
			@mouseenter="showInfo = true"
			@mouseleave="showInfo = false"
		>
			<span v-if="loadingIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">Loading IPFS...</span>
			<span v-else-if="initIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
				>Initialising IPFS...</span
			>
			<span v-else-if="startIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
				>Starting IPFS...</span
			>
			<span v-else-if="initNodes" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
				>Connecting to peers...</span
			>
			<span v-else class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">{{ nodes }} peered nodes</span>
			<CapsuleIcon v-if="!initNodes" :shrink="true" class="text-darkBG dark:text-gray2 modal-animation" />
			<span v-if="initNodes" class="ml-1 flex h-3 w-3 modal-animation">
				<span class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"></span>
				<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
			</span>
			<span v-else class="ml-1 flex h-3 w-3 modal-animation">
				<span
					class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75"
					:class="nodes > 3 ? `bg-positive` : `bg-neutral`"
				></span>
				<span
					class="relative inline-flex h-3 w-3 rounded-full"
					:class="nodes > 3 ? `bg-positive` : `bg-neutral`"
				></span>
			</span>
		</div>
		<!-- Info hover -->
		<div
			v-show="showInfo"
			class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
			:class="settings.isDarkMode ? `NodesInfoOpenDark` : `NodesInfoOpen`"
			style="top: -5px; right: 205px; width: 138%"
		>
			Number of hosts on Blogchain's public network currently serving content
		</div>
	</div>
</template>
<style>
.NodesInfoOpen::before {
	content: '';
	position: absolute;
	top: 1rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.NodesInfoOpenDark::before {
	content: '';
	position: absolute;
	top: 1rem;
	right: -0.5rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #686868;
	border-radius: 2px;
	z-index: 1;
}
</style>
