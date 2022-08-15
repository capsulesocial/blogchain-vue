<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import { formatDate } from '@/helpers/helpers';
import BookmarkButton from '@/components/post/BookmarkButton.vue';
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
import type { IGenericPostResponse } from '@/backend/post';
import type { Profile } from '@/backend/profile';
import { calculateReadingTime } from '@/backend/utilities/helpers';
import { ref } from 'vue';

// Pass post in as prop
const fetchedPost = ref<IGenericPostResponse>({
	post: {
		authorID: `jackistesting`,
		title: `This is the title`,
		subtitle: `This is the subtitle`,
		category: `technology`,
		featuredPhotoCID: null,
		featuredPhotoCaption: null,
		timestamp: 0,
		tags: [{ name: `test` }],
		encrypted: false,
		postImages: [],
		_id: `bafyasdfofdwa3w`,
		excerpt: `here is some content`,
		wordCount: 800,
	},
	bookmarked: false,
	bookmarksCount: 1,
	commentsCount: 1,
	repostCount: 1,
});

// Get profile of authorID
const author = ref<Profile>({
	id: `jackistesting`,
	name: `Jack Dishman`,
	email: `jack@capsule.social`,
	bio: `Testing account`,
	location: `Boston, MA`,
	avatar: ``,
	socials: [],
});
</script>

<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop border-b dark:border-darkBG dark:border-opacity-25 border-opacity-75 py-4 px-5 xl:py-5 xl:px-6 transition ease-in-out hover:bg-hoverPost dark:hover:bg-darkBG dark:hover:bg-opacity-25"
	>
		<div class="flex w-full justify-between">
			<div class="flex">
				<Avatar
					:authorid="author.id"
					:avatar="author.avatar"
					size="w-12 h-12 transition ease-in-out hover:opacity-75 modal-animation"
				/>
			</div>
			<!-- Card profile header -->
			<div class="ml-4 flex flex-grow flex-col">
				<div class="flex flex-row">
					<span
						v-if="author.name !== ``"
						class="text-base dark:text-darkPrimaryText transition ease-in-out hover:underline mr-2 font-medium"
					>
						{{ author.name }}
					</span>
					<span v-else class="text-gray5 dark:text-gray3 text-base transition ease-in-out hover:underline mr-2">
						{{ author.id }}
					</span>
					<span class="text-gray5 dark:text-gray3"> @{{ author.id }} </span>
				</div>
				<!-- Timestamp and reading time -->
				<div class="flex flex-row mt-1 items-center">
					<span class="text-xs text-gray5 dark:text-gray3">
						{{ formatDate(fetchedPost.post.timestamp) }}
					</span>
					<div class="h-1 w-1 rounded-full bg-gray5 dark:bg-gray3 mx-2"></div>
					<span class="text-xs text-gray5 dark:text-gray3">
						{{ calculateReadingTime(fetchedPost.post.wordCount, fetchedPost.post.postImages?.length) }} min read
					</span>
				</div>
			</div>
			<BookmarkButton :has-bookmark="false" />
			<BookmarkIcon class="w-4 h-4" />
		</div>
	</div>
</template>
