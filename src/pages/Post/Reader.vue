<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import XIcon from '@/components/icons/CloseIcon.vue';
import ReaderView from '@/components/post/ReaderView.vue';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/session';
// import { useStoreSettings } from '@/store/settings';
import { getPost, IPostImageKey } from '@/backend/post';
import type { Post } from '@/backend/post';
import type { Profile } from '@/backend/profile';
import { formatDate } from '@/helpers/helpers';
// import { calculateReadingTime } from '@/backend/utilities/helpers';

const store = useStore();
// const storeSettings = useStoreSettings();
const router = useRouter();
const post = ref<Post>();
const authorAvatar = ref<string | ArrayBuffer | undefined>();
const author = ref<Profile>();
const userIsFollowed = ref<boolean>(false);
const isBookmarked = ref<boolean>(false);
const readingTime = ref<number | null>();
const showPaywall = ref<boolean>(false);
const featuredPhoto = ref<string | null>();
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

// Functions
const showPhoto = () => {};
const toggleFriend = () => {};
const getBookmarkStatus = () => {};
const handleClose = () => {
	router.go(-1);
};

// Fetch post
onBeforeMount(async () => {
	const cid = ref<string>(router.currentRoute.value.params.post as string);
	try {
		const res = await (await getPost(cid.value)).data;
		if (!res) {
			return;
		}
		post.value = res;
	} catch (err) {
		throw new Error(err as string);
	}
});
</script>
<template>
	<div
		id="scrollable_content"
		class="w-full flex flex-col items-center py-10 h-screen max-h-screen overflow-y-auto lg:overflow-y-hidden"
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
			<header
				id="header"
				class="page-header xl:w-760 xl:max-w-760 bg-lightBG dark:bg-darkBG border-b border-r border-l border-lightBorder shadow-sm sticky top-0 z-10 flex w-full items-center rounded-b-lg py-2 px-5"
			>
				<div class="trigger-menu-wrapper flex w-full justify-center py-2 ease-in-out">
					<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
						<!-- Left side: name, avatar, date -->
						<div class="flex items-center">
							<Avatar :avatar="authorAvatar" :author-id="post.authorID" size="w-10 h-10" class="mr-4 flex-shrink-0" />
							<div class="pr-8 flex flex-col">
								<router-link
									v-if="author && author.name !== ``"
									:to="`/id/` + post.authorID"
									class="font-semibold dark:text-darkPrimaryText"
									>{{ author.name }}</router-link
								>
								<router-link v-else :to="`/id/` + post.authorID" class="text-gray5 dark:text-gray3 font-semibold">{{
									post.authorID
								}}</router-link>
								<router-link :to="`/id/` + post.authorID" class="text-gray5 dark:text-gray3 text-xs">
									@{{ post.authorID }}</router-link
								>
							</div>
							<!-- <FriendButton
								v-if="post.authorID !== store.id"
								:toggle-friend="toggleFriend"
								:user-is-followed="userIsFollowed"
								class="hidden lg:block"
							/> -->
							<!-- Timestamp and reading time -->
							<div class="flex flex-col lg:flex-row items-center lg:ml-8">
								<span class="text-sm text-gray5 dark:text-gray3">
									{{ formatDate(post.timestamp) }}
								</span>
								<div v-if="readingTime" class="hidden lg:block h-1 w-1 rounded bg-gray5 dark:bg-gray3 mx-2"></div>
								<span v-if="readingTime" class="text-xs lg:text-sm text-gray5 dark:text-gray3">
									{{ readingTime }} min read
								</span>
							</div>
						</div>
						<span class="flex items-center">
							<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="handleClose">
								<XIcon />
							</button>
						</span>
					</div>
				</div>
			</header>
			<section class="mb-5 p-5 lg:p-0 pb-16 pt-2 md:pb-5">
				<!-- Post content -->
				<article class="relative">
					<!-- Category and elipses -->
					<article class="my-5 flex w-full justify-between">
						<router-link :to="`/discover/` + post.category" class="text-primary capitalize">{{
							post.category.replace(`-`, ` `)
						}}</router-link>
						<div class="flex">
							<!-- <BookmarkButton
								:post-i-d="$route.params.post"
								:has-bookmark="isBookmarked"
								class="pr-2"
								@clicked="getBookmarkStatus"
							/> -->
							<!-- Share popup button -->
							<!-- <button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
								style="margin-top: 2px"
								@click="showShare = !showShare"
							>
								<ShareIcon :is-active="showShare" />
							</button> -->
						</div>
					</article>
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
					<div v-if="!post.content && !showPaywall && !featuredPhoto" class="lg:w-760 lg:max-w-760 h-fit w-full">
						<!-- Featured Photo loader -->
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
							<!-- Content loader -->
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
						<!-- Private sensitive content -->
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
									<p class="my-4 text-center text-gray5 dark:text-gray3">
										Become a subscriber of
										<span v-if="author && author.name !== ``" class="font-semibold text-primary">{{
											author.name
										}}</span>
										<span v-else class="font-semibold text-primary">@{{ post.authorID }}</span> to access
										<br class="hidden lg:block" />
										this post and other subscriber-only content
									</p>
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
									<p class="my-4 text-center text-gray5 dark:text-gray3">
										Subscribe to the
										<!-- <span
											v-for="(tier, index) in enabledTierNames.slice(0, 1)"
											:key="index"
											class="text-neutral font-semibold"
											>{{ tier }}</span
										> -->
										tier of
										<span v-if="author && author.name !== ``" class="font-semibold text-primary">{{
											author.name
										}}</span>
										<span v-else class="font-semibold text-primary">@{{ post.authorID }}</span> to access
										<br class="hidden lg:block" />
										this post and other posts of this tier.
									</p>
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
				<AuthorCard
					:author-avatar="authorAvatar"
					:author-name="author ? author.name : ``"
					:author-id="post.authorID"
					:author-bio="author ? author.bio : ``"
					:is-followed="userIsFollowed"
					:toggle-friend="toggleFriend"
					:class="showPaywall ? `mb-10` : ``"
				/>

				<!-- Comments -->
				<article v-if="post !== null && !showPaywall" class="pt-5 pb-14">
					<!-- Choose reaction -->
					<div class="flex flex-row justify-between">
						<div class="flex items-center">
							<!-- <BookmarkButton
								:post-i-d="$route.params.post"
								:has-bookmark="isBookmarked"
								@clicked="getBookmarkStatus"
							/> -->
							<!-- <RepostButton
								:post="post"
								:cid="$route.params.post"
								:has-repost="hasReposted"
								:repost-count="repostCount"
								class="ml-2 mr-3"
								@toggleRepost="handleRepost"
							/> -->
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary mr-4 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
								style="margin-top: 2px"
								@click="showShare = !showShare"
							>
								<ShareIcon :is-active="showShare" />
								<p class="ml-1 text-sm">Share</p>
							</button>
						</div>
					</div>
					<!-- <PostActions
						:post-c-i-d="router.currentRoute.value.params.post"
						:bookmarks-count="bookmarksCount"
						:reposts-count="repostCount"
						:post-author="authorID"
						@reposters="toggleReposters"
						@openQuotes="toggleQuotes"
					/> -->
				</article>
			</section>
		</div>
	</div>
</template>
