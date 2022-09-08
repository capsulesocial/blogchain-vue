<script setup lang="ts">
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import FeaturedPhoto from '@/components/popups/FeaturedPhoto.vue';

useMeta({
	title: `dynamicPostTitle`,
	htmlAttrs: { lang: 'en', amp: true },
});

interface FeaturedPhoto {
	photo: string | null;
	caption: string | null;
}
const toggleFeaturedPhoto = ref<boolean>(true);
const featuredPhoto: FeaturedPhoto = {
	photo: `https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg`,
	caption: `This is a featured photo image`,
};
</script>

<template>
	<FeaturedPhoto v-if="toggleFeaturedPhoto" :featured-photo="featuredPhoto" @close="toggleFeaturedPhoto = false" />
</template>
