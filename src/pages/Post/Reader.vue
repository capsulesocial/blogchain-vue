<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { AxiosError } from 'axios';
import { toastError, toastWarning, toastSuccess } from '@/plugins/toast';
import {
	getOnePost,
	getPost,
	IPostImageKey,
	IPostResponseWithHidden,
	Post,
	isEncryptedPost,
	getDecryptedContent,
	verifyPostAuthenticity,
} from '@/backend/post';

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
import IpfsImage from '@/components/IpfsImage.vue';
import RepostButton from '@/components/post/RepostButton.vue';
import StatsIcon from '@/components/icons/StatsIcon.vue';
import LinkIcon from '@/components/icons/LinkIcon.vue';
import ShareIcon from '@/components/icons/ShareIcon.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import PayWall from '@/components/post/reader/PayWall.vue';
import { ISignedIPFSObject } from '@/backend/utilities/helpers';
import IpfsLoading from '@/components/post/reader/IpfsLoading.vue';
import FeaturedPhotoPopup from '../../components/popups/FeaturedPhotoPopup.vue';
import WarningPopup from '@/components/popups/WarningPopup.vue';
import { useCommentsStore } from '@/store/comments';

const store = useStore();
const settings = useStoreSettings();
const commentsStore = useCommentsStore();
const router = useRouter();
const cid = computed(() => {
	if (typeof router.currentRoute.value.params.post === `string`) {
		return router.currentRoute.value.params.post;
	}

	throw new Error(`post should be a string!`);
});

const post = ref<ISignedIPFSObject<Post>>();
const postMetadata = ref<IPostResponseWithHidden>();
const deleted = ref<boolean>(false);
const showPaywall = ref<boolean>(false);
const content = ref<string>(``);
const excerpt = ref<string>(``);
const wordCount = ref<number>();
const hasFeaturedPhoto = ref<boolean>(false);
const enabledTiers = ref<Array<string>>();
const postImageKeys = ref<Array<IPostImageKey>>([]);
const captionHeight = ref<number | undefined>(0);
const subscriptionStatus = ref<`INSUFFICIENT_TIER` | `NOT_SUBSCRIBED` | ``>(``);
const postComments = computed(() => commentsStore.getCommentsOfPost(cid.value));

// Local states
const showShare = ref<boolean>(false);
const showStats = ref<boolean>(false);
const showQuote = ref<boolean>(false);
const showPhoto = ref<boolean>(false);
const lastScroll = ref<number>(0);
const filter = ref<string>(``);

// Functions
const toggleFriend = () => {};
// const getBookmarkStatus = () => {};

const fetchPostMetadata = async (cid: string, currentUser?: string) => {
	const u = currentUser ? currentUser : `x`;
	try {
		postMetadata.value = await getOnePost(cid, u);
		if (postMetadata.value.hidden) {
			deleted.value = true;
			toastWarning(`This post has been hidden by the author`);
		}
		hasFeaturedPhoto.value = Boolean(postMetadata.value.post.featuredPhotoCID);
	} catch (err: unknown) {
		if (err instanceof Error) {
			toastError(`Error loading post: ${err.message}`);
			return;
		}

		toastError(`Unknown error loading post`);
	}
};
const setFilter = (f: string) => {
	filter.value = f;
};

async function checkEncryption() {
	if (!post.value) {
		return;
	}
	if (!isEncryptedPost(post.value.data)) {
		content.value = post.value.data.content;
		excerpt.value = post.value.data.content.slice(0, 100); // TODO refine
		return;
	}
	if (store.$state.id === ``) {
		showPaywall.value = true;
		return;
	}

	try {
		const decrypted = await getDecryptedContent(cid.value, post.value.data.content, store.$state.id);
		if (`content` in decrypted) {
			content.value = decrypted.content;
			excerpt.value = decrypted.content.slice(0, 100); // TODO refine
			postImageKeys.value = decrypted.postImageKeys;
			return;
		}

		// show proper error message according to retrieval status
		// decrypted.status is of type `INSUFFICIENT_TIER` | `NOT_SUBSCRIBED`
		enabledTiers.value = decrypted.enabledTiers;
		subscriptionStatus.value = decrypted.status;
	} catch (err) {
		if (err instanceof AxiosError && err.response && err.response.data.error) {
			toastError(err.response.data.error);
			return;
		}

		throw err;
	} finally {
		showPaywall.value = true;
	}
}

async function checkAuthenticity() {
	if (!post.value) {
		return;
	}
	const verified = await verifyPostAuthenticity(post.value.data, post.value.sig, post.value.public_key);
	if (!verified) {
		toastError(`Post not verified!`);
	}
}

function checkNewPost() {
	if (settings.recentlyPosted) {
		toastSuccess(`Your post has been successfully published on Blogchain`);
		settings.setRecentlyPosted(false);
		// Trigger share popup
		setTimeout(() => {
			showShare.value = true;
		}, 1500);
	}
}

// Fetch post
onBeforeMount(async () => {
	await fetchPostMetadata(cid.value, store.id);
	const wordcount = postMetadata.value?.post.wordCount ?? 0;
	if (!wordcount) {
		return;
	}
	wordCount.value = wordcount;
});

onMounted(async () => {
	try {
		// Fetching post object
		const res = await getPost(cid.value);
		if (!res) {
			return;
		}
		post.value = res;
		checkAuthenticity();
		checkEncryption();
		checkNewPost();
		if (res.data.content) {
			wordCount.value = res.data.content.split(/\s+/).length;
		}
		// Fetch comments
		await commentsStore.fetchCommentsOfPost(cid.value);
	} catch (err) {
		throw err;
	}
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
</script>
<template>
	<div
		id="scrollable_content"
		class="w-full flex flex-col items-center pb-10 h-screen max-h-screen overflow-y-auto lg:overflow-y-hidden"
	>
		<!-- loader -->
		<article v-if="!postMetadata" class="modal-animation fixed mt-20 flex w-full justify-center">
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
				:id="postMetadata.post.authorID"
				:timestamp="postMetadata.post.timestamp"
				:word-count="wordCount"
				:postimages="postMetadata.post.postImages?.length"
				:toggle-friend="toggleFriend"
			/>
			<!-- Reader -->
			<section class="mb-5 mt-8 p-5 lg:p-0 pb-16 pt-2 md:pb-5">
				<!-- Post content -->
				<article class="relative">
					<!-- Category and actions -->
					<article class="my-5 flex w-full justify-between">
						<router-link :to="`/discover/` + postMetadata.post.category" class="text-primary capitalize">{{
							postMetadata.post.category.replace(`-`, ` `)
						}}</router-link>
						<div class="flex items-center">
							<!-- Bookmark button -->
							<BookmarkButton :has-bookmark="postMetadata.bookmarked" :postcid="postMetadata.post._id" />
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary ml-2 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
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
							{{ postMetadata.post.title }}
						</h1>
						<h2
							v-if="postMetadata.post.subtitle"
							class="text-lightSecondaryText dark:text-gray3 text-h2 mb-3 break-words font-serif font-medium"
						>
							{{ postMetadata.post.subtitle }}
						</h2>
					</article>
					<!-- IPFS loader -->
					<div v-if="!post && !showPaywall && !hasFeaturedPhoto" class="lg:w-760 lg:max-w-760 h-fit w-full">
						<IpfsLoading :content-loader="false" :has-featured-photo="hasFeaturedPhoto" />
					</div>
					<!-- Post content-->
					<div class="relative">
						<!-- Featured Photo -->
						<button
							v-if="hasFeaturedPhoto"
							class="relative mb-5 mt-5 flex cursor-pointer flex-col justify-end w-full"
							@click="showPhoto = true"
						>
							<div
								v-if="post && post.data.featuredPhotoCaption && captionHeight !== undefined"
								class="absolute w-full rounded-b-lg"
								:class="
									captionHeight > 72 ? `h-48` : captionHeight > 52 ? `h-40` : captionHeight > 32 ? `h-32` : `h-24`
								"
								style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
							></div>
							<IpfsImage
								class="w-full rounded-lg object-cover shadow-lg overflow-hidden"
								:cid="postMetadata.post.featuredPhotoCID"
							/>
							<p
								v-if="post && post.data.featuredPhotoCaption"
								ref="photoCaption"
								class="text-lightOnPrimaryText absolute px-4 pb-3 text-sm drop-shadow-lg break-words max-w-full"
								style="text-shadow: 0 0 10px #000"
							>
								{{ post.data.featuredPhotoCaption }}
							</p>
						</button>
						<!-- Content loader -->
						<div v-if="!post && !showPaywall" class="lg:w-760 lg:max-w-760 h-fit w-full mt-6">
							<IpfsLoading :content-loader="true" />
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
						<!-- If post is premium without photo, add height to display the paywall -->
						<div v-else-if="showPaywall && !hasFeaturedPhoto" class="h-64"></div>
						<!-- Post paywall -->
						<article v-if="showPaywall">
							<PayWall
								:id="postMetadata.post.authorID"
								:has-featured-photo="hasFeaturedPhoto"
								:subscription-status="subscriptionStatus"
								:enabled-tiers="enabledTiers ? enabledTiers : []"
							/>
						</article>
						<!-- Content -->
						<article v-else-if="post" class="mt-5">
							<div class="text-lightPrimaryText dark:text-darkSecondaryText editable content max-w-none break-words">
								<ReaderView
									:content="post.data.content"
									:post-images="post.data.postImages"
									:encrypted="post.data.encrypted"
									:post-image-keys="postImageKeys"
								/>
							</div>
						</article>
						<!-- Tags -->
						<article class="mt-5 text-lg">
							<TagCard v-for="t in postMetadata.post.tags" :key="t.name" class="mr-2 mb-2" :tag="t.name" />
						</article>
						<!-- IPFS CID -->
						<div class="mt-3">
							<a
								:href="`https://ipfs.io/api/v0/dag/get?arg=` + cid"
								target="_blank"
								class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 flex flex-row justify-between rounded-lg px-3 py-1"
							>
								<span class="mr-4" style="flex-shrink: 0">IPFS address </span>
								<span class="overflow-hidden" style="text-overflow: ellipsis">{{ cid }}</span>
								<span class="block"><LinkIcon class="py-1" /></span>
							</a>
						</div>
					</div>
				</article>
				<!-- post actions -->
				<article v-if="postMetadata && !showPaywall" class="py-6">
					<div class="flex flex-row justify-between">
						<div class="flex items-center relative">
							<!-- Bookmark button -->
							<BookmarkButton :has-bookmark="postMetadata.bookmarked" :postcid="postMetadata.post._id" />
							<!-- Repost button -->
							<span class="px-2"></span>
							<RepostButton
								:repost="postMetadata.reposted"
								:postcid="postMetadata.post._id"
								:repost-count="postMetadata.repostCount"
								@toggle-action="showQuote = true"
							/>
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
								@click="showShare = true"
							>
								<ShareIcon :is-active="showShare" />
								<p class="ml-1 text-sm">Share</p>
							</button>
						</div>
					</div>
				</article>
				<!-- Author -->
				<AuthorFooter
					:id="postMetadata.post.authorID"
					:toggle-friend="toggleFriend"
					:class="showPaywall ? `mb-20` : ``"
				/>
				<!-- Comments -->
				<article v-if="postMetadata && !showPaywall && !showStats" class="pb-14">
					<!-- filters -->
					<div class="flex w-full justify-between pb-5">
						<div class="flex flex-row items-center">
							<span v-if="postComments" class="pr-2 font-semibold dark:text-darkPrimaryText"
								>{{ postComments.length }} {{ postComments.length === 1 ? 'comment' : 'comments' }}</span
							>
							<button class="focus:outline-none ml-2" @click="showStats = true"><StatsIcon /></button>
						</div>
						<CommentFilter :filter="filter" class="modal-animation" @clicked="setFilter" />
					</div>
					<!-- Comment editor -->
					<CommentEditor :comments-count="postMetadata.commentsCount" :parentcid="postMetadata.post._id" />
					<!-- Comments -->
					<div v-for="c in postComments" :key="c._id">
						<Comment
							:cid="c._id"
							:authorid="c.authorID"
							:emotion="c.emotion"
							:timestamp="c.timestamp"
							:parentcid="c.parentCID"
							:parentauthorid="postMetadata.post.authorID"
							class="mb-4"
						/>
					</div>
				</article>
				<!-- Stats -->
				<article v-if="postMetadata && !showPaywall && showStats" class="pb-14">
					<button class="flex items-center pb-5" @click="showStats = false">
						<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
							<ChevronLeft />
						</div>
						<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
							>All comments</span
						>
					</button>
					<Stats
						:id="postMetadata.post._id"
						:bookmarkscount="postMetadata.bookmarksCount"
						:repostcount="postMetadata.repostCount"
					/>
				</article>
			</section>
		</div>
		<Teleport to="body">
			<SharePopup
				v-if="showShare && postMetadata"
				:id="postMetadata.post._id"
				:title="postMetadata.post.title"
				:subtitle="postMetadata.post.subtitle"
				:excerpt="postMetadata.post.excerpt"
				:featuredphotocid="postMetadata.post.featuredPhotoCID ?? ``"
				:authorid="postMetadata.post.authorID"
				@close="showShare = false"
			/>
			<QuotePopup
				v-if="showQuote && postMetadata"
				:id="postMetadata.post._id"
				:authorid="postMetadata.post.authorID"
				:timestamp="postMetadata.post.timestamp"
				:wordcount="postMetadata.post.wordCount ?? 0"
				:postimages="postMetadata.post.postImages ? postMetadata.post.postImages.length : 0"
				:bookmarked="postMetadata.bookmarked"
				:encrypted="postMetadata.post.encrypted ?? false"
				:title="postMetadata.post.title"
				:subtitle="postMetadata.post.subtitle ?? undefined"
				:excerpt="postMetadata.post.excerpt"
				:featuredphotocid="postMetadata.post.featuredPhotoCID ?? ``"
				:tags="postMetadata.post.tags"
				@close="showQuote = false"
			/>
			<FeaturedPhotoPopup
				v-if="showPhoto"
				:featuredphotocid="postMetadata?.post.featuredPhotoCID ?? ``"
				:featuredphotocaption="post?.data.featuredPhotoCaption ?? ``"
				@close="showPhoto = false"
			/>
			<WarningPopup v-if="deleted" @close="deleted = false" />
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
