<script setup lang="ts">
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import FeaturedPhoto from '@/components/popups/FeaturedPhoto.vue';
import BasicConfirmAlert from '@/components/popups/BasicConfirmAlert.vue';
import ConfirmPopup from '@/components/popups/ConfirmPopup.vue';

useMeta({
	title: `dynamicPostTitle`,
	htmlAttrs: { lang: 'en', amp: true },
});

interface FeaturedPhoto {
	photo: string | null;
	caption: string | null;
}

// set to true to test popups
const toggleFeaturedPhoto = ref<boolean>(true);
const confirmPopup = ref<boolean>(false);
const confirmAlert = ref<boolean>(false);
const text = ref<string>(`Confirm to delist this post`);
const featuredPhoto: FeaturedPhoto = {
	photo: `https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg`,
	caption: `This is a featured photo image`,
};
</script>

<template>
	<div id="scrollable_content">
		<div v-if="toggleFeaturedPhoto">
			<FeaturedPhoto :featured-photo="featuredPhoto" @close="toggleFeaturedPhoto = false" />
		</div>
		<div v-if="confirmAlert">
			<BasicConfirmAlert :text="text" @close="confirmAlert = false" />
		</div>
		<div v-if="confirmPopup">
			<ConfirmPopup @close="confirmPopup = false" />
		</div>
	</div>
</template>
