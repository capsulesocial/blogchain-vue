<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { getOnePost, getPost, IPostImageKey, IPostResponseWithHidden, Post } from '@/backend/post';

import ReaderView from '@/components/post/reader/ReaderView.vue';
import TagCard from '@/components/TagCard.vue';
import CommentFilter from '@/components/post/comments/CommentFilter.vue';
import CommentEditor from '@/components/post/comments/CommentEditor.vue';
import Comment from '@/components/post/comments/Comment.vue';
import BookmarkButton from '@/components/post/BookmarkButton.vue';
import AuthorFooter from '@/components/post/reader/AuthorFooter.vue';
import Header from '@/components/post/reader/Header.vue';
import Stats from '@/components/post/Stats.vue';
import SharePopup from '@/components/popups/SharePopup.vue';
import QuotePopup from '@/components/popups/QuotePopup.vue';

import RepostIcon from '@/components/icons/RepostIcon.vue';
import QuoteIcon from '@/components/icons/QuoteIcon.vue';
import StatsIcon from '@/components/icons/StatsIcon.vue';
import LinkIcon from '@/components/icons/LinkIcon.vue';
import ShareIcon from '@/components/icons/ShareIcon.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';

const store = useStore();
const settings = useStoreSettings();
const router = useRouter();
const post = ref<Post>();
const postMetadata = ref<IPostResponseWithHidden>();
const userIsFollowed = ref<boolean>(false);
const showPaywall = ref<boolean>(false);
const featuredPhoto = ref<string | null>(null);
const hasFeaturedPhoto = ref<boolean>(false);
const initNodes = ref<boolean>(true);
const loadingIPFS = ref<boolean>(true);
const initIPFS = ref<boolean>(false);
const startIPFS = ref<boolean>(false);
const postImageKeys = ref<Array<IPostImageKey>>([]);
const captionHeight = ref<number | undefined>(0);
const subscriptionStatus = ref<`INSUFFICIENT_TIER` | `NOT_SUBSCRIBED` | ``>(``);
// Local states
const showShare = ref<boolean>(false);
const showStats = ref<boolean>(false);
const showReposts = ref<boolean>(false);
const showQuote = ref<boolean>(false);
const lastScroll = ref<number>(0);
const filter = ref<string>(``);

// Functions
const showPhoto = () => {};
const toggleFriend = () => {};
// const getBookmarkStatus = () => {};

const fetchPostMetadata = async (cid: string, currentUser?: string) => {
	const u = currentUser ? currentUser : `x`;
	try {
		postMetadata.value = await getOnePost(cid, u);
	} catch (err) {
		throw new Error(err as string);
	}
};
const setFilter = (f: string) => {
	filter.value = f;
};

// Fetch post
onBeforeMount(async () => {
	const cid = ref<string>(router.currentRoute.value.params.post as string);
	try {
		// Fetching post object
		const res = await (await getPost(cid.value)).data;
		if (!res) {
			return;
		}
		post.value = res;
		await fetchPostMetadata(cid.value, store.id);
	} catch (err) {
		throw new Error(err as string);
	}
	// TODO Fetch featuredPhoto
});

onMounted(() => {
	const container = document.getElementById(`scrollable_content`);
	if (container) {
		container.addEventListener(`scroll`, handleScroll);
	}
});

function handleScroll() {
	const body = document.getElementById(`scrollable_content`);
	const header = document.getElementById(`header`);
	const scrollUp = `scroll-up`;
	const scrollDown = `scroll-down`;
	if (!body) {
		return;
	}
	const currentScroll = body.scrollTop;
	if (!header) {
		return;
	}
	if (body.scrollTop <= 0) {
		header.classList.remove(scrollUp);
		return;
	}
	if (currentScroll > lastScroll.value && !header.classList.contains(scrollDown)) {
		// down
		header.classList.remove(scrollUp);
		header.classList.add(scrollDown);
	} else if (currentScroll < lastScroll.value && header.classList.contains(scrollDown)) {
		// up
		header.classList.remove(scrollDown);
		header.classList.add(scrollUp);
	}
	lastScroll.value = currentScroll;
}

function isReposted() {
	if (postMetadata.value?.reposted) {
		if (postMetadata.value.reposted !== ``) {
			return true;
		}
	}
	return false;
}
</script>
<template>
	<div
		id="scrollable_content"
		class="w-full flex flex-col items-center pb-10 h-screen max-h-screen overflow-y-auto lg:overflow-y-hidden"
	>
		<!-- loader -->
		<article v-if="post === undefined" class="modal-animation fixed mt-20 flex w-full justify-center">
			<div class="flex flex-col items-center mt-10">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</div>
		</article>
		<!-- Inner post area -->
		<div v-else class="lg:w-760 lg:max-w-760 h-fit w-full">
			<!-- Magic header that disappears on scroll down -->
			<Header
				:id="post.authorID"
				:timestamp="post.timestamp"
				:content="post.content"
				:postimages="post.postImages?.length ? post.postImages?.length : 0"
				:is-followed="userIsFollowed"
				:toggle-friend="toggleFriend"
			/>
			<!-- Reader -->
			<section class="mb-5 mt-8 p-5 lg:p-0 pb-16 pt-2 md:pb-5">
				<!-- Post content -->
				<article class="relative">
					<!-- Category and actions -->
					<article class="my-5 flex w-full justify-between">
						<router-link :to="`/discover/` + post.category" class="text-primary capitalize">{{
							post.category.replace(`-`, ` `)
						}}</router-link>
						<div class="flex items-center">
							<!-- Bookmark button -->
							<BookmarkButton :has-bookmark="postMetadata?.bookmarked ? postMetadata?.bookmarked : false" />
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary ml-2 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
								style="margin-top: 2px"
								@click="showShare = !showShare"
							>
								<ShareIcon :is-active="showShare" />
							</button>
						</div>
					</article>
					<!-- Title and subtitle -->
					<article>
						<h1
							class="text-lightPrimaryText dark:text-darkPrimaryText text-h1 mb-3 break-words font-serif font-semibold"
						>
							{{ post.title }}
						</h1>
						<h2
							v-if="post.subtitle"
							class="text-lightSecondaryText dark:text-gray3 text-h2 mb-3 break-words font-serif font-medium"
						>
							{{ post.subtitle }}
						</h2>
					</article>
					<!-- IPFS loader -->
					<div v-if="!post.content && !showPaywall && !featuredPhoto" class="lg:w-760 lg:max-w-760 h-fit w-full">
						<div
							v-if="hasFeaturedPhoto"
							class="h-72 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6 flex justify-center items-center mt-6"
						>
							<div class="flex items-center">
								<span v-if="loadingIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
									>Loading IPFS...</span
								>
								<span v-else-if="initIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
									>Initialising IPFS...</span
								>
								<span v-else-if="startIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
									>Starting IPFS...</span
								>
								<span v-if="loadingIPFS || initIPFS || startIPFS" class="ml-1 flex h-3 w-3 modal-animation">
									<span
										class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"
									></span>
									<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
								</span>
							</div>
						</div>
						<div v-else-if="loadingIPFS || initIPFS || startIPFS" class="mt-6">
							<div class="flex items-center">
								<span v-if="loadingIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
									>Loading IPFS...</span
								>
								<span v-else-if="initIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
									>Initialising IPFS...</span
								>
								<span v-else-if="startIPFS" class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation"
									>Starting IPFS...</span
								>
								<span v-if="loadingIPFS || initIPFS || startIPFS" class="ml-1 flex h-3 w-3 modal-animation">
									<span
										class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"
									></span>
									<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
								</span>
							</div>
						</div>
					</div>
					<!-- Post content-->
					<div class="relative">
						<!-- Featured Photo -->
						<button
							v-if="featuredPhoto !== null"
							class="relative mb-5 mt-5 flex cursor-pointer flex-col justify-end"
							@click="showPhoto"
						>
							<div
								v-if="post && post.featuredPhotoCaption && captionHeight !== undefined"
								class="absolute w-full rounded-b-lg"
								:class="
									captionHeight > 72 ? `h-48` : captionHeight > 52 ? `h-40` : captionHeight > 32 ? `h-32` : `h-24`
								"
								style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
							></div>
							<img :src="featuredPhoto" class="w-full rounded-lg object-cover shadow-lg" />
							<p
								v-if="post && post.featuredPhotoCaption"
								ref="photoCaption"
								class="text-lightOnPrimaryText absolute px-4 pb-3 text-sm drop-shadow-lg break-words max-w-full"
								style="text-shadow: 0 0 10px #000"
							>
								{{ post.featuredPhotoCaption }}
							</p>
						</button>
						<!-- Content loader -->
						<div v-if="!post.content && !showPaywall" class="lg:w-760 lg:max-w-760 h-fit w-full mt-6">
							<div v-if="initNodes && !loadingIPFS && !initIPFS && !startIPFS" class="mb-6">
								<div class="flex items-center">
									<span class="text-gray5 dark:text-gray1 mr-1 text-sm modal-animation">Connecting to peers...</span>
									<span class="ml-1 flex h-3 w-3 modal-animation">
										<span
											class="absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75 bg-gray5 dark:bg-gray3"
										></span>
										<span class="relative inline-flex h-3 w-3 rounded-full bg-gray5 dark:bg-gray3"></span>
									</span>
								</div>
							</div>
							<div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-4/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
								<div class="h-6 w-1/2 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-3/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6"></div>
								<div class="h-3 w-2/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse"></div>
							</div>
						</div>
						<!-- If post is premium, add height to display the paywall -->
						<div
							v-else-if="showPaywall && (!hasFeaturedPhoto || (hasFeaturedPhoto && !featuredPhoto))"
							class="h-64"
						></div>
						<!-- Post paywall -->
						<article
							v-if="showPaywall"
							class="from-lightBGStart to-transparent dark:from-darkBGStart dark:to-transparent bg-gradient-to-t z-10 absolute top-0 w-full h-full flex"
						>
							<div
								class="w-full shadow-lg flex flex-col items-center py-10 px-16 bg-lightBG dark:bg-darkBGStop rounded-lg h-min"
								:class="featuredPhoto !== null ? `sm:mt-36` : `mt-0`"
							>
								<!-- Not a subscriber -->
								<div v-if="subscriptionStatus === `NOT_SUBSCRIBED` || !store.id">
									<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">
										This post is for Paid subscribers
									</h4>
									<!-- <p class="my-4 text-center text-gray5 dark:text-gray3">
										Become a subscriber of
										<span v-if="author && author.name !== ``" class="font-semibold text-primary">{{
											author.name
										}}</span>
										<span v-else class="font-semibold text-primary">@{{ post.authorID }}</span> to access
										<br class="hidden lg:block" />
										this post and other subscriber-only content
									</p> -->
									<div class="flex items-center justify-center">
										<!-- <SubscribeButton
											:toggle-subscription="toggleSubscription"
											:user-is-subscribed="false"
											:enabled-tiers="enabledTiers"
											class="header-profile my-4"
											style="transform: scale(1.2)"
										/> -->
									</div>
									<p v-if="store.id" class="text-sm mt-8 text-center text-gray5 dark:text-gray3">
										Manage my <router-link to="/subscriptions" class="text-neutral text">subscriptions</router-link>
									</p>
								</div>

								<!-- Subscribed, but to a different tier -->
								<div v-if="subscriptionStatus === `INSUFFICIENT_TIER`">
									<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">
										Your subscription tier does not include this post
									</h4>
									<!-- <p class="my-4 text-center text-gray5 dark:text-gray3">
										Subscribe to the
										<span
											v-for="(tier, index) in enabledTierNames.slice(0, 1)"
											:key="index"
											class="text-neutral font-semibold"
											>{{ tier }}</span
										>
										tier of
										<span v-if="author && author.name !== ``" class="font-semibold text-primary">{{
											author.name
										}}</span>
										<span v-else class="font-semibold text-primary">@{{ post.authorID }}</span> to access
										<br class="hidden lg:block" />
										this post and other posts of this tier.
									</p> -->
									<!-- change tier -->
									<div class="flex items-center justify-center">
										<!-- <button
											class="flex flex-row items-center px-6 py-2 mt-4 bg-neutral text-center text-lightButtonText dark:from-darkBG dark:to-darkBG focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
											@click.prevent="switchTierPopup()"
										>
											<CheckCircleStaticIcon class="h-5 w-5 mr-2" />
											<p class="focus:outline-none">Change Tier</p>
										</button> -->
									</div>
									<p v-if="store.id" class="text-sm mt-8 text-center text-gray5 dark:text-gray3">
										Manage my <router-link to="/subscriptions" class="text-neutral text">subscriptions</router-link>
									</p>
									<!-- change tier popup -->
									<!-- <portal to="postPage">
										<ChangeTierPopup
											v-if="showChangeTier"
											:author="author"
											:author-avatar="subscriptionProfileAvatar"
											:s="authorPaymentProfile"
											:to-pre-select-tier="toPreSelectTiers[0]"
											:enabled-tiers="enabledTiers"
											@close="showChangeTier = false"
										/>
									</portal> -->
								</div>
							</div>
						</article>
						<!-- Content -->
						<article v-else-if="post !== null" class="mt-5">
							<div class="text-lightPrimaryText dark:text-darkSecondaryText editable content max-w-none break-words">
								<ReaderView
									:content="post.content"
									:post-images="post.postImages"
									:encrypted="post.encrypted"
									:post-image-keys="postImageKeys"
								/>
							</div>
						</article>
						<!-- Tags -->
						<article class="mt-5 text-lg">
							<TagCard v-for="t in post.tags" :key="t.name" class="mr-2 mb-2" :tag="t.name" />
						</article>
						<!-- IPFS CID -->
						<div class="mt-3">
							<a
								:href="`https://ipfs.io/api/v0/dag/get?arg=` + $route.params.post"
								target="_blank"
								class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 flex flex-row justify-between rounded-lg px-3 py-1"
							>
								<span class="mr-4" style="flex-shrink: 0">IPFS address </span>
								<span class="overflow-hidden" style="text-overflow: ellipsis">{{ $route.params.post }}</span>
								<span class="block"><LinkIcon class="py-1" /></span>
							</a>
						</div>
					</div>
				</article>
				<!-- Author -->
				<AuthorFooter
					:id="post.authorID"
					:is-followed="userIsFollowed"
					:toggle-friend="toggleFriend"
					:class="showPaywall ? `mb-10` : ``"
				/>
				<!-- post actions -->
				<article v-if="post !== null && !showPaywall" class="py-6">
					<div class="flex flex-row justify-between">
						<div class="flex items-center relative">
							<!-- Bookmark button -->
							<BookmarkButton :has-bookmark="postMetadata?.bookmarked ? postMetadata?.bookmarked : false" />
							<!-- Repost button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary ml-4 flex items-center"
								:class="showReposts ? `text-primary` : ``"
								@click="showReposts = !showReposts"
							>
								<RepostIcon class="w-5 h-5" />
								<span class="ml-1 text-sm">{{ postMetadata?.repostCount ? postMetadata?.repostCount : 0 }}</span>
							</button>
							<!-- Repost tooltip -->
							<div
								v-show="showReposts"
								class="bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder modal-animation absolute z-20 flex w-40 flex-col rounded-lg border p-2 shadow-lg"
								:class="settings.isDarkMode ? `dropdownRepostOpenDark` : `dropdownRepostOpen`"
								style="left: 85px; bottom: -2px"
							>
								<!-- Simple Repost -->
								<button class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center">
									<RepostIcon :shrink="true" class="mr-2 p-1" :class="isReposted() ? `text-primary` : ``" />
									<span v-if="isReposted()" class="self-center text-xs">Undo Repost</span>
									<span v-else class="self-center text-xs">Repost to Feed</span>
								</button>
								<!-- Quote Repost -->
								<button
									class="hover:text-primary focus:outline-none text-gray5 dark:text-gray3 flex mr-4 items-center"
									@click="showQuote = true"
								>
									<QuoteIcon class="mr-2 p-1" />
									<span class="self-center text-xs">Quote</span>
								</button>
							</div>
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary ml-4 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
								style="margin-top: 2px"
								@click="showShare = true"
							>
								<ShareIcon :is-active="showShare" />
								<p class="ml-1 text-sm">Share</p>
							</button>
						</div>
					</div>
				</article>
				<!-- Comments -->
				<article v-if="post !== null && !showPaywall && !showStats" class="pb-14">
					<!-- filters -->
					<div class="flex w-full justify-between pb-5">
						<div class="flex flex-row items-center">
							<span v-if="postMetadata" class="pr-2 font-semibold dark:text-darkPrimaryText"
								>{{ postMetadata?.commentsCount }}
								{{ postMetadata?.commentsCount === 1 ? 'comment' : 'comments' }}</span
							>
							<button class="focus:outline-none ml-2" @click="showStats = true"><StatsIcon /></button>
						</div>
						<CommentFilter :filter="filter" class="modal-animation" @clicked="setFilter" />
					</div>
					<!-- Comment editor -->
					<CommentEditor :comments-count="postMetadata?.commentsCount ? postMetadata?.commentsCount : 0" />
					<!-- Comments -->
					<div v-for="i in 20" :key="i"><Comment class="mb-4" /></div>
				</article>
				<!-- Stats -->
				<article v-if="post !== null && !showPaywall && showStats" class="pb-14">
					<button class="flex items-center pb-5" @click="showStats = false">
						<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
							<ChevronLeft />
						</div>
						<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
							>All comments</span
						>
					</button>
					<Stats
						:id="postMetadata?.post._id ? postMetadata?.post._id : ``"
						:bookmarkscount="postMetadata?.bookmarksCount ? postMetadata?.bookmarksCount : 0"
						:repostcount="postMetadata?.repostCount ? postMetadata?.repostCount : 0"
					/>
				</article>
			</section>
		</div>
		<Teleport to="body">
			<SharePopup
				v-if="showShare"
				:id="postMetadata?.post._id ? postMetadata?.post._id : ``"
				:title="post?.title ? post?.title : ``"
				:subtitle="post?.subtitle ? post?.subtitle : null"
				:excerpt="postMetadata?.post.excerpt ? postMetadata?.post.excerpt : ``"
				:featuredphotocid="post?.featuredPhotoCID ? post?.featuredPhotoCID : ``"
				:authorid="post?.authorID ? post?.authorID : ``"
				@close="showShare = false"
			/>
			<QuotePopup
				v-if="showQuote && post"
				:id="postMetadata?.post._id ? postMetadata?.post._id : ``"
				:authorid="post.authorID"
				:timestamp="post.timestamp"
				:wordcount="postMetadata?.post.wordCount ? postMetadata?.post.wordCount : 0"
				:postimages="post.postImages ? post.postImages?.length : 0"
				:bookmarked="postMetadata?.bookmarked ? postMetadata?.bookmarked : false"
				:encrypted="post.encrypted ? post.encrypted : false"
				:title="post.title"
				:subtitle="post?.subtitle ? post?.subtitle : null"
				:excerpt="postMetadata?.post.excerpt ? postMetadata?.post.excerpt : ``"
				:featuredphotocid="post?.featuredPhotoCID ? post?.featuredPhotoCID : ``"
				:tags="post.tags"
				@close="showQuote = false"
			/>
		</Teleport>
	</div>
</template>
<style>
.page-header {
	transition: all 0.3s ease-in-out;
}
.trigger-menu-wrapper {
	transition: all 0.4s;
}
.scroll-down {
	opacity: 0;
	transform: translate3d(0, -20%, 0);
}
.scroll-up {
	opacity: 1;
	transform: none;
}
</style>
