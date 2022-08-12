<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import { formatDate } from '@/helpers/helpers';
import BookmarkButton from '@/components/post/BookmarkButton.vue';
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
</script>

<template>
	<div
		class="bg-lightBG dark:bg-darkBGStop border-b dark:border-darkBG dark:border-opacity-25 border-opacity-75 py-4 px-5 xl:py-5 xl:px-6 transition ease-in-out hover:bg-hoverPost dark:hover:bg-darkBG dark:hover:bg-opacity-25"
	>
		<div class="flex w-full justify-between">
			<div class="flex">
				<Avatar
					:authorid="`asdf`"
					:avatar="``"
					size="w-12 h-12 transition ease-in-out hover:opacity-75 modal-animation"
				/>
			</div>
			<!-- Card profile header -->
			<div class="ml-4 flex flex-grow flex-col">
				<div class="flex flex-row">
					<span class="text-base dark:text-darkPrimaryText transition ease-in-out hover:underline mr-2 font-medium">
						Author name
					</span>
					<span class="text-gray5 dark:text-gray3 text-base transition ease-in-out hover:underline mr-2">
						authorID
					</span>
					<span class="text-gray5 dark:text-gray3"> @authorID </span>
				</div>
				<!-- Timestamp and reading time -->
				<div class="flex flex-row mt-1 items-center">
					<span class="text-xs text-gray5 dark:text-gray3">
						{{ formatDate(0) }}
					</span>
					<div class="h-1 w-1 rounded-full bg-gray5 dark:bg-gray3 mx-2"></div>
					<span class="text-xs text-gray5 dark:text-gray3"> 2 min read </span>
				</div>
			</div>
			<BookmarkButton :has-bookmark="false" />
			<BookmarkIcon class="w-4 h-4" />
		</div>
	</div>
</template>
