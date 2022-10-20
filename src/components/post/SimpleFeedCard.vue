<script setup lang="ts">
import { computed, onBeforeMount, ref, withDefaults } from 'vue';
import Avatar from '@/components/Avatar.vue';
import BookmarkButton from '@/components/post/BookmarkButton.vue';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import TagCard from '@/components/TagCard.vue';
import CommentIcon from '@/components/icons/CommentIcon.vue';
import RepostIcon from '@/components/icons/RepostIcon.vue';
import ShareIcon from '@/components/icons/ShareIcon.vue';
import CrownIcon from '@/components/icons/CrownIcon.vue';
import StatsIcon from '@/components/icons/StatsIcon.vue';
import IpfsImage from '@/components/IpfsImage.vue';
import FriendButton from '@/components/FriendButton.vue';
import ProfileCardHeader from '@/components/post/ProfileCardHeader.vue';
import QuoteListCard from '@/components/post/QuoteListCard.vue';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import type { IGenericPostResponse } from '@/backend/post';
import { useProfilesStore } from '@/store/profiles';
import { createPostExcerpt } from '@/helpers/post';
import TimestampAndReadingTime from '@/components/TimestampAndReadingTime.vue';
import RepostButton from '@/components/post/RepostButton.vue';
import { useCommentsStore } from '@/store/comments';
import router from '@/router';
import { usePostsStore } from '@/store/posts';

const commentsStore = useCommentsStore();
const store = useStore();
const settings = useStoreSettings();
const profilesStore = useProfilesStore();
const showDelete = ref<boolean>(false);
const showProfileCard = ref<boolean>(false);
const hasEntered = ref<boolean>(false);

const props = withDefaults(
	defineProps<{
		fetchedPost?: IGenericPostResponse;
		activeAction?: string;
		homeIndex?: number;
	}>(),
	{
		activeAction: ``,
		fetchedPost: undefined,
		homeIndex: -1,
	},
);

const emit = defineEmits([`toggle-comments`, `toggle-action`, `delete`, `hide`]);

const commentsStats = computed(() => commentsStore.getCommentStats(props.fetchedPost.post._id));
const author = computed(() => profilesStore.getProfile(props.fetchedPost.post.authorID));
const repost = computed(() => {
	if (props.fetchedPost.reposted) {
		return props.fetchedPost.reposted;
	}
	if (
		props.fetchedPost.repost &&
		props.fetchedPost.repost.authorID === store.$state.id &&
		props.fetchedPost.repost.type === `simple`
	) {
		return props.fetchedPost.repost._id;
	}
	return undefined;
});

// Fetch featured photo
function openDeleteDropdown() {
	showDelete.value = true;
	window.addEventListener(`click`, (e) => {
		showDelete.value = false;
	});
}

function triggerProfileCardFalse() {
	setTimeout(() => {
		if (hasEntered.value !== true) {
			showProfileCard.value = false;
			hasEntered.value = false;
		}
	}, 70);
	hasEntered.value = false;
}

function triggerProfileCardTrue() {
	hasEntered.value = true;
	showProfileCard.value = true;
}

function handlePostRedirect() {
	if (router.currentRoute.value.name === `Home`) {
		usePostsStore().setSavedOffset(props.homeIndex);
	}
	router.push(`/post/` + props.fetchedPost.post._id);
}

onBeforeMount(() => {
	profilesStore.fetchProfile(props.fetchedPost.post.authorID);
	commentsStore.fetchCommentsStats(props.fetchedPost.post._id);
});
</script>

<template>
	<div
		v-if="fetchedPost"
		class="bg-lightBG dark:bg-darkBGStop border-b dark:border-darkBG dark:border-opacity-25 border-opacity-75 py-4 px-5 xl:py-5 xl:px-6 transition ease-in-out hover:bg-hoverPost dark:hover:bg-darkBG dark:hover:bg-opacity-25"
	>
		<!-- Simple repost -->
		<div
			v-if="fetchedPost.repost && fetchedPost.repost.type === `simple`"
			class="text-gray5 dark:text-gray3 -mt-2 mb-4 flex w-full items-center pt-2 lg:mb-3"
		>
			<RepostIcon class="hidden lg:block" style="width: 15px; height: 15px" :shrink="true" />
			<p class="text-gray5 dark:text-gray3 hidden pl-2 text-sm lg:block">
				<router-link v-if="fetchedPost.repost.authorID === store.$state.id" :to="`/id/` + store.$state.id"
					>You</router-link
				>
				<router-link v-else :to="`/id/` + fetchedPost.repost.authorID">{{ fetchedPost.repost.authorID }}</router-link>
				reposted
			</p>
		</div>
		<!-- Quote repost -->
		<div v-if="fetchedPost.repost && fetchedPost.repost.type === `quote`">
			<QuoteListCard
				:authorid="fetchedPost.repost.authorID"
				:timestamp="fetchedPost.repost.timestamp"
				:cid="fetchedPost.repost._id"
				@hide="emit(`hide`)"
			/>
		</div>
		<!-- Inner post area -->
		<div
			:class="
				fetchedPost.repost && fetchedPost.repost.type === `quote`
					? `bg-lightBorder xl:dark:bg-darkInput rounded-lg p-4`
					: ``
			"
		>
			<!-- Card profile header -->
			<div class="flex w-full justify-between relative">
				<div class="flex" @mouseover="triggerProfileCardTrue" @mouseleave="triggerProfileCardFalse">
					<Avatar
						:authorid="author.id"
						:cid="author.avatar"
						:size="`w-12 h-12`"
						class="transition ease-in-out hover:opacity-75 modal-animation"
					/>
				</div>
				<div class="ml-4 flex flex-grow flex-col">
					<router-link :to="`/id/` + author.id" class="flex flex-row">
						<span
							v-if="author.name !== ``"
							class="text-base dark:text-darkPrimaryText transition ease-in-out hover:underline mr-2 font-medium"
							@mouseover="triggerProfileCardTrue"
							@mouseleave="triggerProfileCardFalse"
						>
							{{ author.name }}
						</span>
						<span
							v-else
							class="text-gray5 dark:text-gray3 text-base transition ease-in-out hover:underline mr-2"
							@mouseover="triggerProfileCardTrue"
							@mouseleave="triggerProfileCardFalse"
						>
							{{ author.id }}
						</span>
						<span class="text-gray5 dark:text-gray3"> @{{ author.id }} </span>
					</router-link>
					<!-- Timestamp and reading time -->
					<TimestampAndReadingTime
						class="flex flex-row mt-1 items-center"
						:timestamp="fetchedPost.post.timestamp"
						:word-count="fetchedPost.post.wordCount"
						:number-of-post-images="fetchedPost.post.postImages?.length"
					/>
				</div>
				<!-- hover profile card -->
				<div
					v-show="showProfileCard"
					class="border-lightBorder modal-animation-delay absolute z-40 flex w-72 flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-4 shadow-lg"
					style="top: 60px"
					@mouseover="triggerProfileCardTrue"
					@mouseleave="showProfileCard = false"
				>
					<div class="w-full flex flex-row justify-between items-center mb-4">
						<Avatar :authorid="author.id" :cid="author.avatar" size="w-16 h-16" />
						<FriendButton
							v-if="fetchedPost.post.authorID !== store.$state.id && $route.name !== `id`"
							:authorid="author.id"
						/>
					</div>
					<ProfileCardHeader :author-i-d="author.id" :author-name="author.name" :is-hover-card="true" />
					<span v-if="author.bio !== ``" class="mt-2 dark:text-darkPrimaryText">
						{{ author.bio.slice(0, 150) + (author.bio.length > 150 ? '...' : '') }}
					</span>
				</div>
				<!-- bookmark -->
				<div class="relative flex items-center">
					<BookmarkButton :has-bookmark="fetchedPost.bookmarked" :postcid="fetchedPost.post._id" />
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
						<button class="focus:outline-none text-negative flex items-center" @click="emit(`delete`)">
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
					<div class="cursor-pointer" @click="handlePostRedirect">
						<div class="flex max-w-full flex-col overflow-hidden pr-4">
							<div class="flex flex-row w-full justify-between">
								<h3 class="break-words pb-2 text-lg font-semibold dark:text-darkPrimaryText">
									{{ fetchedPost.post.title
									}}<CrownIcon v-if="fetchedPost.post.encrypted" class="ml-2 inline text-neutral w-5 h-5 -mt-1" />
								</h3>
							</div>
							<h6 class="break-words text-lightSecondaryText dark:text-darkSecondaryText">
								{{
									fetchedPost.post.subtitle ? fetchedPost.post.subtitle : createPostExcerpt(fetchedPost.post.excerpt)
								}}
							</h6>
						</div>
					</div>
					<!-- Display tags (Desktop) -->
					<div class="my-2 hidden overflow-x-auto xl:flex xl:flex-wrap text-lg">
						<TagCard
							v-for="t in fetchedPost.post.tags"
							:key="t.name"
							:tag="t.name"
							:no-click="false"
							class="my-2 mr-4"
						/>
					</div>
					<!-- Actions buttons (Desktop) -->
					<div class="text-gray5 dark:text-gray3 mt-1 hidden xl:flex xl:items-center relative">
						<!-- Comment -->
						<button
							class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary mr-4 flex items-center"
							:class="activeAction === `comments` ? `text-primary` : ``"
							@click="emit(`toggle-action`, `comments`)"
						>
							<CommentIcon :is-active="activeAction === `comments`" class="w-5 h-5 mr-1" />
							<span class="ml-1 text-sm">{{ commentsStats?.total }}</span>
						</button>
						<!-- Repost -->
						<RepostButton
							:postcid="fetchedPost.post._id"
							:repost="repost"
							:repost-count="fetchedPost.repostCount"
							@toggle-action="emit(`toggle-action`, `quote`)"
						/>
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
				<div
					v-if="fetchedPost.post.featuredPhotoCID !== `` && fetchedPost.post.featuredPhotoCID"
					class="cursor-pointer"
					:to="`/post/` + fetchedPost.post._id"
					@click="handlePostRedirect"
				>
					<IpfsImage
						class="mt-4 w-full flex-shrink-0 xl:mt-0 xl:w-56 h-48 xl:h-32 rounded-lg"
						:img-class="'h-48 w-full flex-shrink-0 rounded-lg xl:h-32'"
						:cid="fetchedPost.post.featuredPhotoCID"
					/>
				</div>
			</div>
			<!-- Display tags (Mobile) -->
			<div class="my-2 flex flex-wrap overflow-x-auto xl:hidden">
				<TagCard v-for="t in fetchedPost.post.tags" :key="t.name" :tag="t.name" :no-click="false" class="my-2 mr-4" />
			</div>
			<!-- Comment and share (Mobile) -->
			<div class="text-gray5 dark:text-gray3 mt-1 flex xl:hidden relative">
				<button
					class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary mr-4 hover:fill-primary flex items-center"
					:class="activeAction === `comments` ? `text-primary` : ``"
					@click="emit(`toggle-action`, `comments`)"
				>
					<CommentIcon :is-active="activeAction === `comments`" class="w-5 h-5" />
					<span class="ml-1 text-sm">{{ commentsStats?.total }}</span>
				</button>
				<!-- Repost popup -->
				<RepostButton
					:postcid="fetchedPost.post._id"
					:repost="repost"
					:repost-count="fetchedPost.repostCount"
					@toggle-action="emit(`toggle-action`, `quote`)"
				/>
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
