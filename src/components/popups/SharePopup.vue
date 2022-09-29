<script setup lang="ts">
import { toastError, toastSuccess } from '../../plugins/toast';
import { onMounted, ref } from 'vue';
import { createPostExcerpt } from '@/helpers/post';
import { createShareableLink } from '@/backend/shareable_links';
import { sanitizeUrl } from '@braintree/sanitize-url';

import IpfsImage from '@/components/IpfsImage.vue';
import CloseIcon from '../icons/CloseIcon.vue';
import TwitterIcon from '../icons/brands/solid/Twitter.vue';
import FacebookIcon from '../icons/brands/solid/Facebook.vue';
import RedditIcon from '../icons/brands/solid/Reddit.vue';
import LinkedinIcon from '../icons/brands/solid/Linkedin.vue';
import MailIcon from '../icons/brands/solid/Mail.vue';
import CopyIcon from '../icons/Copy.vue';
import ChevronDown from '../icons/ChevronDown.vue';
import ChevronUp from '../icons/ChevronUp.vue';

const emit = defineEmits([`close`]);

const props = withDefaults(
	defineProps<{
		id: string;
		title: string;
		subtitle: string | null;
		excerpt: string;
		featuredphotocid: string;
		authorid: string;
	}>(),
	{},
);

const image = ref<string>(``);

const isOpen1 = ref<boolean>(false);
const isLoading = ref<boolean>(true);

const generatedDirectLink = ref<string>(``);
const generatedBlogchainLink = ref<string>(``);

function toggleAccordion1() {
	isOpen1.value = !isOpen1.value;
}

function copyDirectLink() {
	if (generatedDirectLink.value === ``) {
		return;
	}

	navigator.clipboard
		.writeText(generatedDirectLink.value)
		.then(() => {
			toastSuccess(`Link copied to clipboard!`);
		})
		.catch(() => {
			toastError(`Could not copy link to clipboard`);
		});
}

function copyBlogchainLink() {
	if (generatedBlogchainLink.value === ``) {
		return;
	}

	navigator.clipboard
		.writeText(generatedBlogchainLink.value)
		.then(() => {
			toastSuccess(`Link copied to clipboard!`);
		})
		.catch(() => {
			toastError(`Could not copy link to clipboard`);
		});
}

async function generateShareableLink() {
	generatedDirectLink.value = await createShareableLink(props.id);
	generatedBlogchainLink.value = `https://blogchain.app/post/${props.id}`;
	isLoading.value = false;
}

function twitterShare() {
	window.open(
		sanitizeUrl(
			`https://twitter.com/share?url=${encodeURIComponent(
				generatedDirectLink.value.toString(),
			)}&hashtags=blogchain&text=${props.title} by ${props.authorid}`,
		),
	);
}

function facebookShare() {
	window.open(sanitizeUrl(`https://www.facebook.com/sharer/sharer.php?u=${generatedDirectLink.value}`));
}

function redditShare() {
	window.open(sanitizeUrl(`https://reddit.com/submit?url=${generatedDirectLink.value}&title=${props.title}`));
}

function linkedinShare() {
	window.open(
		sanitizeUrl(
			`https://www.linkedin.com/shareArticle?url=${generatedDirectLink.value}&title=${props.title}&summary=${
				props.subtitle ? props.subtitle : createPostExcerpt(props.excerpt)
			}&source=blogchain.app`,
		),
	);
}

function mailShare() {
	window.open(
		sanitizeUrl(
			`mailto:?subject=${props.title}&body=${
				props.subtitle ? props.subtitle : createPostExcerpt(props.excerpt)
			}%0D%0A%0D%0A${generatedDirectLink.value}`,
		),
	);
}
onMounted(async (): Promise<void> => {
	generateShareableLink();
});
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<div
			class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<!-- popup title -->
			<div class="sticky flex items-center justify-between mb-4">
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">Share this post</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<!-- post preview -->
			<div
				class="bg-lightInput dark:bg-darkInput p-4 rounded-lg w-full flex flex-col lg:flex-row items-start lg:items-center"
			>
				<IpfsImage
					v-if="props.featuredphotocid !== ``"
					class="mt-4 w-full flex-shrink-0 lg:mt-0 lg:w-56 modal-animation lg:mr-4"
					:img-class="'h-48 w-full flex-shrink-0 rounded-lg xl:h-32'"
					:cid="props.featuredphotocid"
				/>
				<div class="flex max-w-full flex-col overflow-hidden">
					<p class="text-gray5 dark:text-gray3 text-sm mb-2">blogchain.app</p>
					<h3 class="break-words mb-1 text-base font-semibold dark:text-darkPrimaryText">
						{{ props.title }}
					</h3>
					<h6 v-if="image" class="max-w-420 break-words text-sm dark:text-darkSecondaryText">
						{{ props.subtitle ? props.subtitle : createPostExcerpt(props.excerpt) }}
					</h6>
					<h6
						v-if="!image"
						class="max-w-mobileCard xl:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
					>
						{{ props.subtitle ? props.subtitle : createPostExcerpt(props.excerpt) }}
					</h6>
				</div>
			</div>
			<!-- socials share -->
			<div class="flex flex-col mt-5">
				<label for="newName" class="mb-2 font-semibold dark:text-darkPrimaryText">Socials</label>
				<div class="flex flex-row flex-wrap text-primary">
					<button
						class="bg-lightInput dark:bg-darkInput p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						@click="twitterShare()"
					>
						<TwitterIcon />
					</button>
					<button
						class="bg-lightInput dark:bg-darkInput p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						@click="facebookShare()"
					>
						<FacebookIcon />
					</button>
					<button
						class="bg-lightInput dark:bg-darkInput p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						@click="redditShare()"
					>
						<RedditIcon />
					</button>
					<button
						class="bg-lightInput dark:bg-darkInput p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						@click="linkedinShare()"
					>
						<LinkedinIcon />
					</button>
					<button
						class="bg-lightInput dark:bg-darkInput p-5 rounded-lg flex flex-row items-center mr-4 mb-2"
						@click="mailShare()"
					>
						<MailIcon />
					</button>
				</div>
			</div>
			<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-6 mb-2">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid`"
				></div>
			</div>
			<!-- Direct Link -->
			<div v-if="!isLoading" class="flex flex-col mt-3 w-full">
				<label for="newName" class="mb-1 font-semibold dark:text-darkPrimaryText">Direct Link</label>
				<p class="text-gray5 dark:text-gray3 mb-2">Social media friendly link that you can share on any platform</p>
				<div class="relative flex w-full h-8 rounded-lg bg-gray1 dark:bg-gray7 items-center">
					<input
						v-model="generatedDirectLink"
						class="absolute w-4/5 ml-2 overflow-hidden dark:text-darkPrimaryText bg-transparent focus:outline-none"
						style="text-overflow: ellipsis"
						disabled
					/>
					<button
						class="text-primary flex items-center focus:outline-none absolute right-0 mr-3 text-xs"
						@click="copyDirectLink()"
					>
						<CopyIcon class="h-4 w-4 fill-current mr-1" />
						<p>Copy</p>
					</button>
				</div>
			</div>
			<!-- Expand Link -->
			<div
				v-if="!isLoading"
				class="message-header relative flex items-center justify-between mt-5 w-full"
				@click="toggleAccordion1()"
			>
				<div class="w-1/3 bg-gray3 dark:bg-gray2 rounded-lg" style="height: 1px"></div>
				<div
					:class="isOpen1 ? `plus0 hidden` : `plus1`"
					class="w-1/3 text-center icon flex flex-row items-center justify-center"
				>
					<p class="text-sm text-gray5 dark:text-gray3 mr-2">More</p>
					<ChevronDown class="text-gray5 dark:text-gray3" style="margin-top: 1px" />
				</div>
				<div
					:class="!isOpen1 ? `minus0 hidden` : `minus1`"
					class="w-1/3 text-center icon flex flex-row items-center justify-center"
				>
					<p class="text-sm text-gray5 dark:text-gray3 mr-2">Less</p>
					<ChevronUp class="text-gray5 dark:text-gray3" style="margin-top: 1px" />
				</div>
				<div class="w-1/3 bg-gray3 dark:bg-gray2 rounded-lg" style="height: 1px"></div>
			</div>
			<!-- Blogchain Link -->
			<div v-if="!isLoading" :class="isOpen1 ? `mt-5` : `is-closed`" class="flex flex-col w-full message-body">
				<label for="newName" class="mb-1 font-semibold dark:text-darkPrimaryText">Blogchain Link</label>
				<p class="text-gray5 dark:text-gray3 mb-2">IPFS decentralized permanent link</p>
				<div class="relative flex w-full h-8 rounded-lg bg-gray1 dark:bg-gray7 items-center">
					<input
						v-model="generatedBlogchainLink"
						class="absolute w-4/5 ml-2 overflow-hidden dark:text-darkPrimaryText bg-transparent focus:outline-none"
						style="text-overflow: ellipsis"
						disabled
					/>
					<button
						class="text-primary flex items-center focus:outline-none absolute right-0 mr-3 text-xs"
						@click="copyBlogchainLink()"
					>
						<CopyIcon class="h-4 w-4 fill-current mr-1" />
						<p>Copy</p>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.message-header {
	cursor: pointer;
}

.message-header .icon {
	transition: all 0.6s;
}

.message-body {
	padding: 0;
	max-height: 20em;
	overflow: hidden;
	transition: all 0.6s;
}
.plus0 {
	opacity: 0;
}

.plus1 {
	opacity: 1;
}

.minus0 {
	opacity: 0;
}

.minus1 {
	opacity: 1;
}

.is-closed {
	max-height: 0;
}
</style>
