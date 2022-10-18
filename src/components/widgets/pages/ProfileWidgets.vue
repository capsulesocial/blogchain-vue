<script setup lang="ts">
import ProfileInfosWidget from '@/components/widgets/ProfileInfosWidget.vue';
import FollowersWidget from '@/components/widgets/FollowersWidget.vue';
import MutualsFollowersWidget from '@/components/widgets/MutualsFollowersWidget.vue';
import EmailNewsletter from '@/components/widgets/EmailNewsletter.vue';
</script>
<template>
	<ProfileInfosWidget />
	<EmailNewsletter />
	<MutualsFollowersWidget />
	<FollowersWidget />
</template>
