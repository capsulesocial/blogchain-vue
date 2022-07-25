<script setup lang="ts">
import CloseIcon from '../icons/CloseIcon.vue'
// import CheckedIcon from '../icons/CheckCircleIcon.vue'
import TwitterIcon from '../icons/brands/solid/Twitter.vue'
import FacebookIcon from '../icons/brands/solid/Facebook.vue'
import RedditIcon from '../icons/brands/solid/Reddit.vue'
import LinkedinIcon from '../icons/brands/solid/Linkedin.vue'
import MailIcon from '../icons/brands/solid/Mail.vue'
import CopyIcon from '../icons/Copy.vue'
import ChevronDown from '../icons/ChevronDown.vue'
import ChevronUp from '../icons/ChevronUp.vue'
import { toastSuccess } from '../../plugins/toast'
import axios from 'axios'
import { ref } from 'vue'
import { capsuleServer, baseUrl } from './../../backend/utilities/config'
import { handleError } from '@/plugins/toast'

const props = defineProps({
	image: { type: String, required: true },
	title: { type: String, required: true },
	subtitle: { type: String, required: true },
	cid: { type: String, required: true },
	authorID: { type: String, required: true },
})

const directLink = ref<HTMLInputElement>()
const blogchainLink = ref<HTMLInputElement>()

const isOpen1 = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const generatedDirectLink = ref<string>(``)

const generatedBlogchainLink = ref<string>(``)

function toggleAccordion1() {
	isOpen1.value = !isOpen1.value
}

function copyDirectLink() {
	if (generatedDirectLink.value === `` || !directLink.value) {
		return
	}
	directLink.value.setSelectionRange(0, directLink.value.value.length)
	directLink.value.focus()
	document.execCommand(`copy`)
	toastSuccess(`Link copied to clipboard!`)
}

function copyBlogchainLink() {
	if (generatedBlogchainLink.value === `` || !blogchainLink.value) {
		return
	}
	blogchainLink.value.setSelectionRange(0, blogchainLink.value.value.length)
	blogchainLink.value.focus()
	document.execCommand(`copy`)
	toastSuccess(`Link copied to clipboard!`)
}

async function generateLinks() {
	// Might need backend investigation into error response on production
	if (!props.cid) {
		return
	}
	const cid: string = props.cid
	generatedBlogchainLink.value = `${baseUrl}/post/${cid}`
	try {
		const shareableLink = await axios.post(`${capsuleServer}/share`, {
			cid,
		})
		generatedDirectLink.value = shareableLink.data.data
	} catch (ex) {
		handleError(ex)
	}
	isLoading.value = false
}

function twitterShare() {
	window.open(
		`https://twitter.com/share?url=${encodeURIComponent(
			generatedDirectLink.value.toString(),
		)}&hashtags=blogchain&text=${props.title} by ${props.authorID}`,
	)
}

function facebookShare() {
	window.open(`https://www.facebook.com/sharer/sharer.php?u=${generatedDirectLink.value}`)
}

function redditShare() {
	window.open(`https://reddit.com/submit?url=${generatedDirectLink.value}&title=${props.title}`)
}

function linkedinShare() {
	window.open(
		`https://www.linkedin.com/shareArticle?url=${generatedDirectLink.value}&title=${props.title}&summary=${props.subtitle}&source=blogchain.app`,
	)
}

function mailShare() {
	window.open(`mailto:?subject=${props.title}&body=${props.subtitle}%0D%0A%0D%0A${generatedDirectLink.value}`)
}

generateLinks()
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<div
			style="backdrop-filter: blur(10px)"
			class="w-full lg:w-600 min-h-40 max-h-90 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-5 shadow-lg"
		>
			<!-- popup title -->
			<div class="sticky flex items-center justify-between mb-6">
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">Share this post</h2>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<!-- post preview -->
			<div
				class="bg-lightInput dark:bg-darkInput p-4 rounded-lg w-full flex flex-col lg:flex-row items-start lg:items-center"
			>
				<img
					v-if="image != ``"
					:src="image"
					class="h-48 w-full lg:w-48 flex-shrink-0 rounded-lg object-cover lg:h-32 mb-4 lg:mb-0 lg:mr-4"
				/>
				<div class="flex max-w-full flex-col overflow-hidden">
					<p class="text-gray5 dark:text-gray3 text-sm mb-2">blogchain.app</p>
					<h3 class="break-words mb-1 text-base font-semibold dark:text-darkPrimaryText">
						{{ title }}
					</h3>
					<h6 v-if="image" class="max-w-420 break-words text-sm dark:text-darkSecondaryText">
						{{ subtitle }}
					</h6>
					<h6
						v-if="!image"
						class="max-w-mobileCard xl:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
					>
						{{ subtitle }}
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
			<!-- Direct Link -->
			<div class="flex flex-col mt-3 w-full">
				<label for="newName" class="mb-1 font-semibold dark:text-darkPrimaryText">Direct Link</label>
				<p class="text-gray5 dark:text-gray3 mb-2">Social media friendly link that you can share on any platform</p>
				<div class="relative flex w-full h-8 rounded-lg bg-gray1 dark:bg-gray7 items-center">
					<input
						id="id"
						ref="directLink"
						v-model="generatedDirectLink"
						class="absolute w-4/5 ml-2 overflow-hidden dark:text-darkPrimaryText bg-transparent focus:outline-none"
						style="text-overflow: ellipsis"
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
			<div class="message-header relative flex items-center justify-between mt-5 w-full" @click="toggleAccordion1()">
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
			<div :class="isOpen1 ? `mt-5` : `is-closed`" class="flex flex-col w-full message-body">
				<label for="newName" class="mb-1 font-semibold dark:text-darkPrimaryText">Blogchain Link</label>
				<p class="text-gray5 dark:text-gray3 mb-2">IPFS decentralized permanent link</p>
				<div class="relative flex w-full h-8 rounded-lg bg-gray1 dark:bg-gray7 items-center">
					<input
						id="id"
						ref="blogchainLink"
						v-model="generatedBlogchainLink"
						class="absolute w-4/5 ml-2 overflow-hidden dark:text-darkPrimaryText bg-transparent focus:outline-none"
						style="text-overflow: ellipsis"
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
