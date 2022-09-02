<script setup lang="ts">
import HomeWidgets from '@/components/widgets/pages/HomeWidgets.vue';
import DiscoverWidgets from '@/components/widgets/pages/DiscoverWidgets.vue';
import BookmarksWidgets from '@/components/widgets/pages/BookmarksWidgets.vue';
import ProfileWidgets from '@/components/widgets/pages/ProfileWidgets.vue';
import HelpWidgets from '@/components/widgets/pages/HelpWidgets.vue';
import SettingsWidgets from '@/components/widgets/pages/SettingsWidgets.vue';
import Footer from '@/components/Footer.vue';
import SubscriptionsWidgets from '@/components/widgets/pages/SubscriptionsWidgets.vue';
import TagsWidgets from './widgets/pages/TagsWidgets.vue';
</script>
<template>
	<aside class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 pb-32 lg:block min-h-61 h-61">
		<HomeWidgets v-if="$route.name === `Home`" />
		<DiscoverWidgets v-if="$route.name === `Discover`" />
		<BookmarksWidgets v-if="$route.name === `Bookmarks`" />
		<ProfileWidgets v-if="$route.matched[0]?.path === `/id/:id`" />
		<HelpWidgets v-if="$route.name === `Help`" />
		<SettingsWidgets v-if="$route.matched[0]?.path === `/settings`" />
		<SubscriptionsWidgets v-if="$route.name === `Subscriptions`" />
		<DiscoverWidgets v-if="$route.name === `Category`" />
		<TagsWidgets v-if="$route.name === `Tag`" />
		<Footer />
	</aside>
</template>
