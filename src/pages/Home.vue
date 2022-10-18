<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '@/store/posts';
import { useRootStore } from '@/store/index';
import { useStore } from '@/store/session';
import { useConnectionsStore } from '@/store/connections';
import { useStoreSettings } from '@/store/settings';
import { useRoute } from 'vue-router';

import ChevronUp from '@/components/icons/ChevronUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import PostCardContainer from '@/components/post/PostCardContainer.vue';
import OnboardingWizard from '@/components/popups/OnboardingWizard.vue';
import BrandedButton from '@/components/BrandedButton.vue';
import ReloadIcon from '@/components/icons/ReloadIcon.vue';
import Editor from '@/pages/Post/Editor.vue';

import { Algorithm, Timeframe, readableTimeframe, IGenericPostResponse } from '@/backend/post';

const postsStore = usePostsStore();
const rootStore = useRootStore();
const store = useStore();
const connectionsStore = useConnectionsStore();
const { homeFeed, displayTimeframe } = storeToRefs(postsStore);
const storeSettings = useStoreSettings();
const route = useRoute();

// refs
const showAlgorithmDropdown = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const homePosts = ref<IGenericPostResponse[]>([]);
const following = computed(() => connectionsStore.getConnections(store.$state.id)?.following);

const scrollListener = async (e: Event) => {
	if (isLoading.value) {
		return;
	}
	const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
	if (scrollTop + clientHeight >= scrollHeight - 5) {
		isLoading.value = true;
		const newPosts = await postsStore.fetchHomePosts();
		homePosts.value = homePosts.value.concat(newPosts);
		isLoading.value = false;
	}
};

const handleFeedSwitch = async (alg: Algorithm, timeframe?: Timeframe) => {
	if (alg === `FOLLOWING` && store.$state.id === ``) {
		rootStore.toggleUnauthPopup(true);
		return;
	}
	if (alg === postsStore.homeFeed.algorithm && !timeframe) {
		return;
	}
	if (alg === `TOP` && timeframe) {
		postsStore.setTimeframe(timeframe);
	}
	if (postsStore.homeFeed.algorithm !== alg || timeframe) {
		homePosts.value = [];
	}
	isLoading.value = true;
	postsStore.setSavedOffset(0, true);
	postsStore.setAlgorithm(alg);
	const newPosts = await postsStore.fetchHomePosts();
	homePosts.value = homePosts.value.concat(newPosts);
	isLoading.value = false;
};

async function handleReloadAction() {
	postsStore.setSavedOffset(0, true);
	postsStore.setCurrentOffset(0);
	homePosts.value = [];
	await initHome();
}

async function initHome() {
	isLoading.value = true;
	const newPosts = await postsStore.fetchHomePosts();
	homePosts.value = homePosts.value.concat(newPosts);
	isLoading.value = false;
}

onMounted(async () => {
	if (postsStore.$state.homeFeed.savedOffset > 0) {
		postsStore.$state.homeFeed.currentOffset = postsStore.$state.homeFeed.savedOffset;
	} else {
		postsStore.$state.homeFeed.currentOffset = 0;
	}
	await initHome();
	document.addEventListener(`click`, (e) => {
		if (!showAlgorithmDropdown.value) {
			return;
		}
		showAlgorithmDropdown.value = false;
	});
	if (scrollContainer.value) {
		scrollContainer.value.addEventListener('scroll', scrollListener);
	}
});
</script>

<template>
	<!-- Editor Widget -->
	<div v-if="storeSettings.$state.widgets.primary === `editor` && route.name === `Home`">
		<Editor />
	</div>
	<!-- Home Widget -->
	<div v-else>
		<nav class="flex w-full flex-row justify-between text-sm rounded-t-lg bg-lightBG dark:bg-darkBGStop shadow-sm">
			<div class="flex">
				<button
					:class="
						homeFeed.algorithm === Algorithm.FOLLOWING ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`
					"
					class="flex items-center focus:outline-none h-full w-full py-4 px-6"
					@click="handleFeedSwitch(Algorithm.FOLLOWING)"
				>
					Following
				</button>
				<button
					:class="homeFeed.algorithm === Algorithm.NEW ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center px-6 focus:outline-none h-full w-full py-4"
					@click="handleFeedSwitch(Algorithm.NEW)"
				>
					New
				</button>
				<button
					:class="homeFeed.algorithm === Algorithm.TOP ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center focus:outline-none h-full w-full py-4 px-6"
					@click="handleFeedSwitch(Algorithm.TOP)"
				>
					Top
				</button>
			</div>
			<!-- Top algorithms -->
			<div v-if="homeFeed.algorithm === Algorithm.TOP" class="flex items-center relative modal-animation lg:pr-6">
				<button
					id="filter"
					class="toggle focus:outline-none lg:ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 text-sm shadow-lg dark:text-gray3"
					@click.stop="showAlgorithmDropdown = !showAlgorithmDropdown"
				>
					<span class="toggle font-bold capitalize pl-4">
						{{ displayTimeframe }}
					</span>
					<ChevronUp v-if="showAlgorithmDropdown" class="toggle pr-4" />
					<ChevronDown v-else class="toggle pr-4" />
				</button>
				<div
					v-if="showAlgorithmDropdown"
					class="hotzone border-lightBorder modal-animation absolute top-0 right-0 z-20 rounded-lg border bg-lightBG dark:bg-darkBG px-4 py-3 shadow-lg mr-0 lg:mr-6"
					style="margin-top: 40px"
				>
					<div
						v-for="timeframe in [Timeframe.WEEK, Timeframe.MONTH, Timeframe.YEAR, Timeframe.ALL_TIME]"
						:key="timeframe"
						class="hotzone flex justify-start items-start flex-col dark:text-gray3"
					>
						<button
							:class="homeFeed.timeframe === timeframe ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
							class="hotzone focus:outline-none my-1 px-2 whitespace-nowrap"
							@click="handleFeedSwitch(Algorithm.TOP, timeframe)"
						>
							{{ readableTimeframe(timeframe) }}
						</button>
					</div>
				</div>
			</div>
		</nav>
		<div
			id="scrollable_content"
			ref="scrollContainer"
			class="min-h-115 h-115 lg:min-h-210 lg:h-210 xl:min-h-220 xl:h-220 w-full overflow-y-auto lg:overflow-y-hidden relative"
		>
			<!-- Not following anyone -->
			<div
				v-if="
					!isLoading && postsStore.homeFeed.algorithm === `FOLLOWING` && following?.size === 0 && homePosts.length === 0
				"
				class="relative h-full overflow-y-hidden"
			>
				<div class="flex flex-col justify-center p-12">
					<h2 class="text-center text-2xl font-semibold dark:text-darkPrimaryText">Welcome 🚀</h2>
					<p class="text-gray5 dark:text-gray3 mb-5 mt-2 self-center text-center xl:mx-14">
						It seems like you don't follow anyone yet. You can visit the Top feed to follow top rated content creators
						and start your Blogchain experience!
					</p>
					<div class="flex justify-center">
						<BrandedButton
							:action="
								() => {
									handleFeedSwitch(Algorithm.TOP);
								}
							"
							:text="`Top posts`"
						/>
					</div>
				</div>
				<img v-lazy="{ src: require(`@/assets/images/brand/follow-window.webp`) }" class="top-0 xl:mt-0" />
			</div>
			<!-- If saved offset is > 0 -->
			<button
				v-if="postsStore.$state.homeFeed.savedOffset !== 0"
				ref="reload"
				class="flex w-full justify-center items-center text-sm text-primary py-2 hover:bg-gray1 dark:hover:bg-darkBG hover:bg-opacity-25 dark:hover:bg-opacity-25 transition ease-in-out"
				@click="handleReloadAction"
			>
				<ReloadIcon class="mr-2 w-4 h-4" />
				Load newest posts
			</button>

			<div v-for="post in homePosts" :key="`new_${post.post._id}`">
				<PostCardContainer :fetched-post="post" :home-index="homePosts.indexOf(post)" />
			</div>
			<p v-if="postsStore.homeFeed.noMorePosts" class="text-gray5 dark:text-gray3 py-5 text-center text-sm">
				No more posts
			</p>
			<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-24">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</div>
		</div>
	</div>
	<!-- Onboarding Wizard -->
	<OnboardingWizard v-if="rootStore.$state.recentlyJoined" />
</template>
