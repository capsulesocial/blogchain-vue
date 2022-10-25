<script setup lang="ts">
import TagsWidget from '@/components/widgets/TagsWidget.vue';
import FollowersWidget from '@/components/widgets/FollowersWidget.vue';
import DraftsWidget from '@/components/widgets/DraftsWidget.vue';
import BookmarksWidget from '@/components/widgets/BookmarksWidget.vue';
import XIcon from '@/components/icons/CloseIcon.vue';
import CheckCircle from '@/components/icons/CheckCircle.vue';
import PencilIcon from '@/components/icons/Pencil.vue';
import BookmarksIcon from '@/components/icons/Bookmarks.vue';

import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { storeToRefs } from 'pinia';
import { useStore } from '@/store/session';
import { useRootStore } from '@/store/index';

const store = useStore();
const rootStore = useRootStore();
const settingsStore = useStoreSettings();
const { primaryWidget, secondaryWidget, secondary2Widget } = storeToRefs(settingsStore);
const showConfigure = ref(false);

function changePrimary(widget: `feed` | `editor`) {
	// update state
	settingsStore.setPrimaryWidget(widget);
}

function changeSecondary(widget: `drafts` | `bookmarks`) {
	// Update state
	settingsStore.setSecondaryWidget(widget);
}

function changeSecondary2(widget: `tags` | `followers`) {
	// update state
	settingsStore.setSecondary2Widget(widget);
}

function handleConfigure() {
	if (store.$state.id !== ``) {
		showConfigure.value = true;
		return;
	}
	rootStore.toggleUnauthPopup(true);
}
</script>
<template>
	<TagsWidget v-if="secondary2Widget === `tags`" />
	<FollowersWidget v-if="secondary2Widget === `followers`" />
	<DraftsWidget v-if="secondaryWidget === `drafts`" />
	<BookmarksWidget v-if="secondaryWidget === `bookmarks`" />
	<!-- Configure popup button -->
	<button
		class="bg-lightBG dark:bg-darkBGStop focus:outline-none mb-5 w-full rounded-lg border border-lightBorder shadow-lg"
		style="height: 80px; background-repeat: no-repeat; background-position: -6em center; background-size: cover"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/configure-my-capsule.webp`)})` }"
		@click="handleConfigure"
	>
		<p class="text-primary text-right text-sm flex flex-row justify-end">
			<span class="p-6 xl:pr-0" style="background: opacity 0.9em">Configure</span>
			<span class="p-6 pl-1 hidden xl:block">my Blogchain</span>
		</p>
	</button>
	<!-- Configure popup -->
	<div
		v-if="showConfigure"
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="showConfigure = false"
	>
		<div class="popup flex flex-col items-center w-full justify-center" @click.self="showConfigure = false">
			<button
				class="bg-gray1 dark:bg-gray5 focus:outline-none m-6 mt-28 rounded-full p-1"
				@click="showConfigure = false"
			>
				<XIcon />
			</button>
			<!-- Container -->
			<section class="flex w-full lg:w-11/12 xl:w-10/12 flex-row max-w-1220">
				<!-- Primary widget -->
				<article
					style="min-height: calc(100vh - 140px); height: calc(100vh - 140px)"
					class="lg:w-7.5 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
				>
					<h3 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 text-base font-semibold">Primary widget</h3>
					<!-- Select a main widget -->
					<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
						<button
							class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder h-64 rounded-lg"
							@click="changePrimary(`feed`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 dark:text-gray3 mb-2">Post feed</h4>
								<div class="bg-darkBG my-2 h-8 w-40 rounded-lg"></div>
								<div class="bg-darkBG mb-2 h-8 w-40 rounded-lg"></div>
								<div class="bg-darkBG mb-2 h-8 w-40 rounded-lg"></div>
								<CheckCircle :is-checked="primaryWidget === `feed` ? true : false" class="text-primary mt-2 h-6 w-6" />
							</div>
						</button>
						<button
							class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder h-64 rounded-lg"
							@click="changePrimary(`editor`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 dark:text-gray3">Draft Editor</h4>
								<div class="h-32 w-40 flex items-center justify-center">
									<span class="text-lightPrimaryText text-6xl font-semibold">Aa</span>
								</div>
								<CheckCircle :is-checked="primaryWidget === `editor` ? true : false" class="text-primary h-6 w-6" />
							</div>
						</button>
					</div>
				</article>
				<!-- Right side: side widgets -->
				<div class="w-5/12 -mr-5 -mt-4 hidden h-full p-4 lg:block">
					<article
						class="bg-lightBG dark:bg-darkBGStop card-animation-delay1 z-10 mb-5 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
					>
						<h3 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 text-base font-semibold">Side widget</h3>
						<div class="grid grid-cols-2 gap-5">
							<button
								class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
								@click="changeSecondary2(`tags`)"
							>
								<div class="flex flex-col items-center">
									<h4 class="text-gray5 dark:text-gray3 mb-2">Topics</h4>
									<div class="bg-darkBG my-2 flex h-8 w-32 items-center rounded-lg">
										<span class="pl-3 text-darkPrimaryText">#</span>
									</div>
									<CheckCircle
										:is-checked="secondary2Widget === `tags` ? true : false"
										class="text-primary mt-2 h-6 w-6"
									/>
								</div>
							</button>
							<button
								class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
								@click="changeSecondary2(`followers`)"
							>
								<div class="flex flex-col items-center">
									<h4 class="text-gray5 dark:text-gray3 mb-2">Followers</h4>
									<div class="my-2 flex h-8 w-32 items-center">
										<span class="bg-darkBG h-8 w-8 flex-shrink-0 flex-grow-0 rounded-full"></span>
										<span class="bg-gray5 dark:bg-gray3 ml-2 h-4 w-full rounded-full"></span>
									</div>
									<CheckCircle
										:is-checked="secondary2Widget === `followers` ? true : false"
										class="text-primary mt-2 h-6 w-6"
									/>
								</div>
							</button>
						</div>
					</article>
					<article
						class="bg-lightBG dark:bg-darkBGStop card-animation-delay2 z-10 mb-5 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
					>
						<h3 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 text-base font-semibold">Side widget</h3>
						<div class="grid grid-cols-2 gap-5">
							<button
								class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
								@click="changeSecondary(`drafts`)"
							>
								<div class="flex flex-col items-center">
									<h4 class="text-gray5 dark:text-gray3 mb-2">Drafts</h4>
									<div class="my-2 flex h-8 w-32 items-center justify-center">
										<span class="bg-darkBG rounded-lg p-2 text-darkPrimaryText">
											<PencilIcon class="fill-current text-darkPrimaryText" />
										</span>
									</div>
									<CheckCircle
										:is-checked="secondaryWidget === `drafts` ? true : false"
										class="text-primary mt-2 h-6 w-6"
									/>
								</div>
							</button>
							<button
								class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
								@click="changeSecondary(`bookmarks`)"
							>
								<div class="flex flex-col items-center">
									<h4 class="text-gray5 dark:text-gray3 mb-2">Bookmarks</h4>
									<div class="my-2 flex h-8 w-32 items-center justify-center">
										<span class="bg-darkBG rounded-lg p-2 text-darkPrimaryText">
											<BookmarksIcon class="fill-current text-darkPrimaryText" />
										</span>
									</div>
									<CheckCircle
										:is-checked="secondaryWidget === `bookmarks` ? true : false"
										class="text-primary mt-2 h-6 w-6"
									/>
								</div>
							</button>
						</div>
					</article>
					<div
						class="bg-lightBG dark:bg-darkBGStop focus:outline-none card-animation-delay3 mb-5 flex w-full flex-row items-center rounded-lg shadow-lg"
						style="height: 60px"
					>
						<div class="flex flex-col xl:flex-row items-start justify-between px-6">
							<p class="text-gray5 dark:text-gray3 text-sm">
								<span style="background: opacity 0.9em">Change background, theme and accessibilty:</span>
							</p>
							<router-link to="/settings/styling" class="text-primary xl:ml-2 text-sm">
								<span style="background: opacity 0.9em">Styling settings</span>
							</router-link>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>
