<script setup lang="ts">
import SideNav from '@/components/SideNav.vue'
import Footer from '@/components/Footer.vue'
import Ressouces from '@/components/Ressources.vue'
</script>
<template>
	<aside
		class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 lg:block"
		:style="`min-height: calc(100vh - 150px); height: calc(100vh - 80px)`"
	>
		<SideNav
			class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 overflow-hidden rounded-lg border bg-gradient-to-r shadow-lg"
			style="backdrop-filter: blur(10px)"
		/>
		<Ressouces />
		<Footer />
	</aside>
</template>
