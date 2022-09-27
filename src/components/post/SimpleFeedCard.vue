<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue';
import Avatar from '@/components/Avatar.vue';
import BookmarkButton from '@/components/post/BookmarkButton.vue';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import TagCard from '@/components/TagCard.vue';
import CommentIcon from '@/components/icons/CommentIcon.vue';
import RepostIcon from '@/components/icons/RepostIcon.vue';
import QuoteIcon from '@/components/icons/QuoteIcon.vue';
import ShareIcon from '@/components/icons/ShareIcon.vue';
import CrownIcon from '@/components/icons/Crown.vue';
import StatsIcon from '@/components/icons/StatsIcon.vue';
import IpfsImage from '@/components/IpfsImage.vue';

import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import type { IGenericPostResponse } from '@/backend/post';
import { useProfilesStore } from '@/store/profiles';
import { createPostExcerpt } from '@/helpers/post';
import TimestampAndReadingTime from '@/components/TimestampAndReadingTime.vue';

const store = useStore();
const settings = useStoreSettings();
const profilesStore = useProfilesStore();
const showDelete = ref<boolean>(false);
const showReposts = ref<boolean>(false);

const props = withDefaults(
	defineProps<{
		fetchedPost?: IGenericPostResponse;
		activeAction?: string;
	}>(),
	{
		activeAction: ``,
		fetchedPost: undefined,
	},
);

const emit = defineEmits([`toggle-comments`, `toggle-action`]);

// Get profile of authorID
const author = computed(() => profilesStore.getProfile(props.fetchedPost.post.authorID));

// Fetch featured photo

function deletePost() {}
function openDeleteDropdown() {
	showDelete.value = true;
	window.addEventListener(`click`, (e) => {
		showDelete.value = false;
	});
}

function isReposted() {
	if (props.fetchedPost.reposted) {
		if (props.fetchedPost.reposted !== ``) {
			return true;
		}
	}
	return false;
}

function simpleRepost() {
	showReposts.value = false;
	// todo : simple repost request
}

function quoteRepost() {
	showReposts.value = false;
	emit(`toggle-action`, `quote`);
}

profilesStore.fetchProfile(props.fetchedPost.post.authorID);
</script>

<template>
	<div
		v-if="fetchedPost"
		class="bg-lightBG dark:bg-darkBGStop dark:border-darkBG dark:border-opacity-25 border-opacity-75 py-4 px-5 xl:py-5 xl:px-6 transition ease-in-out hover:bg-hoverPost dark:hover:bg-darkBG dark:hover:bg-opacity-25"
	>
		<!-- Card profile header -->
		<div class="flex w-full justify-between">
			<div class="flex">
				<Avatar
					:authorid="author.id"
					:cid="author.avatar"
					:size="`w-12 h-12`"
					class="transition ease-in-out hover:opacity-75 modal-animation"
				/>
			</div>
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
				<TimestampAndReadingTime
					class="flex flex-row mt-1 items-center"
					:timestamp="fetchedPost.post.timestamp"
					:word-count="fetchedPost.post.wordCount"
					:number-of-post-images="fetchedPost.post.postImages?.length"
				/>
			</div>
			<div class="relative flex items-center">
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
			</div>
		</div>
		<!-- Content -->
		<div class="mt-4 flex flex-col justify-between xl:flex-row">
			<!-- Left side: Title, subtitle / preview, tags -->
			<div class="mr-4 flex w-full flex-col justify-between">
				<router-link class="cursor-pointer" :to="`/post/` + fetchedPost.post._id">
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
				</router-link>
				<!-- Display tags (Desktop) -->
				<div class="my-2 hidden overflow-x-auto xl:flex xl:flex-wrap text-lg">
					<TagCard v-for="t in fetchedPost.post.tags" :key="t.name" :tag="t.name" class="my-2 mr-4" />
				</div>
				<!-- Actions buttons (Desktop) -->
				<div class="text-gray5 dark:text-gray3 mt-1 hidden xl:flex xl:items-center relative">
					<!-- Comment -->
					<button
						class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary mr-4 flex items-center"
						:class="activeAction === `comments` ? `text-primary` : ``"
						@click="emit(`toggle-action`, `comments`)"
					>
						<CommentIcon :is-active="activeAction === `comments`" class="w-5 h-5" />
						<span class="ml-1 text-sm">{{ fetchedPost.commentsCount }}</span>
					</button>
					<!-- Repost -->
					<button
						class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary mr-4 flex items-center"
						:class="showReposts ? `text-primary` : ``"
						@click="showReposts = !showReposts"
					>
						<RepostIcon class="w-5 h-5" />
						<span class="ml-1 text-sm">{{ fetchedPost.repostCount }}</span>
					</button>
					<div
						v-show="showReposts"
						class="bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder modal-animation absolute z-20 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
						:class="settings.isDarkMode ? `dropdownRepostOpenDark` : `dropdownRepostOpen`"
						style="left: 95px; bottom: -2px"
					>
						<!-- Simple Repost -->
						<button
							class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
							@click="simpleRepost()"
						>
							<RepostIcon :shrink="true" class="mr-2 p-1" :class="isReposted() ? `text-primary` : ``" />
							<span v-if="isReposted()" class="self-center text-xs">Undo Repost</span>
							<span v-else class="self-center text-xs">Repost to Feed</span>
						</button>
						<!-- Quote Repost -->
						<button
							class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
							@click="quoteRepost()"
						>
							<QuoteIcon class="mr-2 p-1" />
							<span class="self-center text-xs">Quote</span>
						</button>
					</div>
					<!-- Share popup button -->
					<button
						class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary mr-4 dark:hover:text-primary flex items-center"
						:class="activeAction === `share` ? `text-primary` : ``"
						style="margin-top: 2px"
						@click="emit(`toggle-action`, `share`)"
					>
						<ShareIcon :is-active="activeAction === `share`" />
						<p class="ml-1 text-sm">Share</p>
					</button>
					<button class="focus:outline-none" @click="emit(`toggle-action`, `stats`)"><StatsIcon /></button>
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
		<!-- Display tags (Mobile) -->
		<div class="my-2 flex flex-wrap overflow-x-auto xl:hidden">
			<TagCard v-for="t in fetchedPost.post.tags" :key="t.name" :tag="t.name" class="my-2 mr-4" />
		</div>
		<!-- Comment and share (Mobile) -->
		<div class="text-gray5 dark:text-gray3 mt-1 flex xl:hidden relative">
			<button
				class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary mr-4 hover:fill-primary flex items-center"
				:class="activeAction === `comments` ? `text-primary` : ``"
				@click="emit(`toggle-action`, `comments`)"
			>
				<CommentIcon :is-active="activeAction === `comments`" class="w-5 h-5" />
				<span class="ml-1 text-sm">{{ fetchedPost.commentsCount }}</span>
			</button>
			<!-- Repost popup -->
			<button
				class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary mr-4 flex items-center"
				:class="showReposts ? `text-primary` : ``"
				@click="showReposts = !showReposts"
			>
				<RepostIcon class="w-5 h-5" />
				<span class="ml-1 text-sm">{{ fetchedPost.repostCount }}</span>
			</button>
			<div
				v-show="showReposts"
				class="bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder modal-animation absolute z-20 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
				:class="settings.isDarkMode ? `dropdownRepostOpenDark` : `dropdownRepostOpen`"
				style="left: 95px; bottom: -2px"
			>
				<!-- Simple Repost -->
				<button
					class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
					@click="simpleRepost()"
				>
					<RepostIcon :shrink="true" class="mr-2 p-1" :class="isReposted() ? `text-primary` : ``" />
					<span v-if="isReposted()" class="self-center text-xs">Undo Repost</span>
					<span v-else class="self-center text-xs">Repost to Feed</span>
				</button>
				<!-- Quote Repost -->
				<button
					class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
					@click="quoteRepost()"
				>
					<QuoteIcon class="mr-2 p-1" />
					<span class="self-center text-xs">Quote</span>
				</button>
			</div>
			<!-- Share popup button -->
			<button
				class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary mr-4 hover:fill-primary flex items-center"
				:class="activeAction === `share` ? `text-primary` : ``"
				style="margin-top: 2px"
				@click="emit(`toggle-action`, `share`)"
			>
				<ShareIcon :is-active="activeAction === `share`" />
				<p class="ml-1 text-sm">Share</p>
			</button>
			<button class="focus:outline-none" @click="emit(`toggle-action`, `stats`)"><StatsIcon /></button>
		</div>
	</div>
</template>

<style>
.dropdownDeleteOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.8rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownDeleteOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.8rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
.dropdownRepostOpen::before {
	content: '';
	position: absolute;
	top: 2.6rem;
	left: -0.4rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}

.dropdownRepostOpenDark::before {
	content: '';
	position: absolute;
	top: 2.6rem;
	left: -0.4rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
}
</style>
