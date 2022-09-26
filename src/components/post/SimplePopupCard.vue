<script setup lang="ts">
import { computed, ref } from 'vue';
import { IGenericPostResponse } from '@/backend/post';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { useProfilesStore } from '@/store/profiles';
import { createPostExcerpt } from '@/helpers/post';

import Avatar from '@/components/Avatar.vue';
import BookmarkButton from '@/components/post/BookmarkButton.vue';
import TagCard from '@/components/TagCard.vue';
import IpfsImage from '@/components/IpfsImage.vue';

import XIcon from '@/components/icons/XIcon.vue';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import CrownIcon from '@/components/icons/Crown.vue';
import TimestampAndReadingTime from '@/components/TimestampAndReadingTime.vue';

const store = useStore();
const settings = useStoreSettings();
const profilesStore = useProfilesStore();
const showDelete = ref<boolean>(false);

const emit = defineEmits([`close`]);

const props = withDefaults(
	defineProps<{
		fetchedPost: IGenericPostResponse;
	}>(),
	{},
);

// Get profile of authorID
const author = computed(() => profilesStore.getProfile(props.fetchedPost.post.authorID));

function deletePost() {}
function openDeleteDropdown() {
	showDelete.value = true;
	window.addEventListener(`click`, (e) => {
		showDelete.value = false;
	});
}
</script>
<template>
	<!-- container -->
	<div class="px-4 py-4 lg:px-6 lg:py-5 shadow-sm">
		<!-- Top: avatar, name, id, close -->
		<div class="flex w-full justify-between">
			<div class="flex flex-row">
				<div class="flex">
					<Avatar
						:authorid="author.id"
						:cid="author.avatar"
						:size="`w-12 h-12`"
						class="transition ease-in-out hover:opacity-75 modal-animation"
					/>
				</div>
				<div class="ml-4 hidden flex-grow flex-col lg:flex">
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
					<TimestampAndReadingTime
						class="flex flex-row mt-1 items-center"
						:timestamp="fetchedPost.post.timestamp"
						:word-count="fetchedPost.post.wordCount"
						:number-of-post-images="fetchedPost.post.postImages?.length"
					/>
				</div>
			</div>
			<div class="relative flex w-full items-center justify-center lg:w-1/5 lg:justify-end">
				<!-- Bookmarks button -->
				<BookmarkButton :has-bookmark="fetchedPost.bookmarked" />
				<button
					v-if="fetchedPost.post.authorID === store.$state.id"
					class="focus:outline-none text-gray5 dark:text-gray3 ml-2"
					@click.stop="openDeleteDropdown"
				>
					<MoreIcon />
				</button>
				<div
					v-if="showDelete"
					class="dropdownDeleteOpen border-lightBorder modal-animation absolute z-10 right-0 flex w-36 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
					:class="settings.isDarkMode ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
					:style="`margin-top: 70px;margin-right: -10px;`"
				>
					<!-- Delete -->
					<button class="focus:outline-none text-negative flex items-center" @click.self="deletePost">
						<BinIcon class="m-1 w-4 h-4" />
						<span class="text-negative self-center text-xs text-center w-full">Remove from feed</span>
					</button>
				</div>
				<button
					class="bg-gray1 dark:bg-gray5 focus:outline-none right-0 top-0 ml-0 rounded-full p-1 lg:ml-4"
					@click="emit(`close`)"
				>
					<XIcon />
				</button>
			</div>
		</div>
		<!-- Content -->
		<div class="mt-4 flex flex-col justify-between xl:flex-row">
			<!-- Left side: Title, subtitle / preview, tags -->
			<div class="mr-4 flex w-full flex-col justify-between">
				<a class="cursor-pointer" href="#">
					<div class="flex max-w-full flex-col overflow-hidden pr-4">
						<div class="flex flex-row w-full justify-between">
							<h3 class="break-words pb-2 text-lg font-semibold dark:text-darkPrimaryText">
								{{ fetchedPost.post.title
								}}<CrownIcon v-if="fetchedPost.post.encrypted" class="ml-2 inline text-neutral w-5 h-5 -mt-1" />
							</h3>
						</div>
						<h6 class="break-words text-lightSecondaryText dark:text-darkSecondaryText">
							{{ fetchedPost.post.subtitle ? fetchedPost.post.subtitle : createPostExcerpt(fetchedPost.post.excerpt) }}
						</h6>
					</div>
				</a>
				<!-- Display tags (Desktop) -->
				<div class="my-2 hidden overflow-x-auto xl:flex xl:flex-wrap text-lg">
					<TagCard v-for="t in fetchedPost.post.tags" :key="t.name" :tag="t.name" class="my-2 mr-4" />
				</div>
			</div>
			<!-- Right side: Image -->
			<router-link
				v-if="fetchedPost.post.featuredPhotoCID !== `` && fetchedPost.post.featuredPhotoCID"
				class="cursor-pointer"
				:to="`/post/` + fetchedPost.post._id"
			>
				<IpfsImage
					class="mt-4 w-full flex-shrink-0 xl:mt-0 xl:w-56 h-48 xl:h-32 rounded-lg"
					:img-class="'h-48 w-full flex-shrink-0 rounded-lg xl:h-32'"
					:cid="fetchedPost.post.featuredPhotoCID"
				/>
			</router-link>
		</div>
	</div>
</template>
