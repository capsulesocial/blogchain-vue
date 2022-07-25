<script setup lang="ts">
import OpenLinkIcon from './../components/icons/OpenLinkIcon.vue'
import CrownEmptyIcon from './../components/icons/CrownEmptyIcon.vue'
import LinkIcon from './../components/icons/LinkIcon.vue'
import BinIcon from './../components/icons/BinIcon.vue'
import ViewIcon from './../components/icons/ViewIcon.vue'
import CommentIcon from './../components/icons/CommentIcon.vue'
import RepostIcon from './../components/icons/RepostIcon.vue'
import BookmarkIcon from './../components/icons/BookmarkIcon.vue'
import CrownIcon from './../components/icons/CrownIcon.vue'
import SharePopup from './../components/popups/SharePopup.vue'
import BasicConfirmAlert from './../components/popups/BasicConfirmAlert.vue'
import { ref, PropType, onMounted, onBeforeUpdate } from 'vue'
import ManagePremiumAccess from './../components/popups/ManagePremiumAccess.vue'
import { IGenericPostResponse, RetrievedPost } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { baseUrl } from './../backend/utilities/config'
import { usePostsStore } from '@/store/posts'
import { toastSuccess, handleError } from '@/plugins/toast'

const emit = defineEmits([`updated`])
const props = defineProps({
	post: {
		type: Object as PropType<RetrievedPost>,
		required: true,
	},
	postResponse: {
		type: Object as PropType<IGenericPostResponse>,
		required: true,
	},
})

const showAccessPopup = ref<boolean>(false)
const showSharePopup = ref<boolean>(false)
const showAlertDelete = ref<boolean>(false)
const featuredPhoto = ref<string>('')

function toggleAccessPopup() {
	showAccessPopup.value = !showAccessPopup.value
}

function toggleSharePopup() {
	showSharePopup.value = !showSharePopup.value
}

function toggleConfirmDelete() {
	showAlertDelete.value = !showAlertDelete.value
}

async function deletePost() {
	showAlertDelete.value = false
	try {
		await usePostsStore().deletePost(props.post._id)
		toastSuccess('This post was successfully deleted')
		emit(`updated`)
	} catch (err) {
		handleError(err)
	}
}

async function fetchFeaturedPhoto() {
	if (!props.post.featuredPhotoCID) {
		featuredPhoto.value = ''
		return
	}
	getPhotoFromIPFS(props.post.featuredPhotoCID).then((p) => {
		featuredPhoto.value = p
	})
}

onBeforeUpdate(() => {
	fetchFeaturedPhoto()
})

onMounted(() => {
	fetchFeaturedPhoto()
})
</script>

<template>
	<div
		class="flex flex-col xl:flex-row items-center p-4 border border-lightBorder from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG rounded-lg bg-gradient-to-r shadow-sm modal-animation"
	>
		<Teleport to="body">
			<SharePopup
				v-if="showSharePopup"
				:image="featuredPhoto"
				:author-i-d="post.authorID"
				:title="post.title"
				:subtitle="post.subtitle"
				:cid="post._id"
				@close="toggleSharePopup"
			/>
			<ManagePremiumAccess
				v-if="showAccessPopup"
				:image="featuredPhoto"
				:title="post.title"
				:subtitle="post.subtitle"
				:tiers="post.enabledTiers ?? []"
				:cid="post._id"
				@close="toggleAccessPopup"
			/>
			<BasicConfirmAlert
				v-if="showAlertDelete"
				:text="`Are you sure you want to delete this post? This action is permanent`"
				@close="showAlertDelete = false"
				@confirm="deletePost"
			/>
		</Teleport>
		<!-- Left side: content -->
		<div class="flex flex-col w-full xl:w-4/5">
			<!-- content -->
			<div class="flex flex-col-reverse xl:flex-row items-center">
				<!-- image -->
				<div v-if="featuredPhoto" class="w-full xl:w-5/12 mt-4 xl:mt-0 mr-0 xl:mr-4">
					<img :src="featuredPhoto" class="h-48 w-full flex-shrink-0 rounded-lg object-cover lg:h-32" />
				</div>
				<!-- title, subtitle -->
				<div
					class="flex max-w-full flex-col overflow-hidden px-0 xl:pr-4 w-full mb-0 xl:mb-4"
					:class="featuredPhoto ? `xl:w-8/12` : `xl:w-full`"
				>
					<div class="flex flex-row items-center pb-2">
						<h3 class="break-words text-lg font-semibold dark:text-darkPrimaryText flex">
							{{ post.title }}
							<span><CrownIcon class="ml-2 text-neutral" /></span>
						</h3>
					</div>
					<h6 v-if="featuredPhoto" class="max-w-420 break-words dark:text-darkSecondaryText">
						{{ post.subtitle }}
					</h6>
					<h6
						v-else
						class="max-w-mobileCard lg:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
					>
						{{ post.subtitle }}
					</h6>
				</div>
			</div>
			<!-- stats -->
			<div class="flex flex-row justify-between xl:justify-start items-center mt-4 text-gray5 dark:text-gray3">
				<div class="text-sm flex flex-row items-center mr-12">
					<ViewIcon class="h-5 w-5 mr-2 flex items-center" />
					<p class="focus:outline-none text-sm">
						{{ postResponse.viewsCount ?? 0 }}
					</p>
				</div>
				<div class="text-sm flex flex-row items-center mr-12">
					<CommentIcon class="h-5 w-5 mr-2" style="padding: 0.1em" />
					<p class="focus:outline-none text-sm">
						{{ postResponse.commentsCount }}
					</p>
				</div>
				<div class="text-sm flex flex-row items-center mr-12">
					<RepostIcon class="h-5 w-5 mr-2" style="padding: 0.1em" />
					<p class="focus:outline-none text-sm">
						{{ postResponse.repostCount }}
					</p>
				</div>
				<div class="text-sm flex flex-row items-center">
					<BookmarkIcon class="h-5 w-5 mr-2" style="padding: 0.1em" />
					<p class="focus:outline-none text-sm">
						{{ postResponse.bookmarksCount }}
					</p>
				</div>
			</div>
		</div>
		<div class="hidden xl:block h-full min-h-4 bg-lightBorder dark:bg-darkBorder" style="width: 1px"></div>
		<!-- Right side: admin actions -->
		<div class="flex items-center pl-2 pr-2 xl:pl-6 xl:pr-2 w-full xl:w-1/5 mt-4 xl:mt-0">
			<div class="flex flex-row justify-between xl:flex-col w-full items-center xl:items-start">
				<a
					:href="`${baseUrl}/post/${post._id}`"
					target="_blank"
					class="text-gray5 dark:text-gray3 py-2 text-sm flex flex-row items-center"
				>
					<OpenLinkIcon class="h-5 w-5 mr-2" style="padding: 0.1em" />
					<p class="focus:outline-none text-sm">Open post</p>
				</a>
				<button class="text-gray5 dark:text-gray3 py-2 text-sm flex flex-row items-center" @click="toggleAccessPopup">
					<CrownEmptyIcon class="h-5 w-5 mr-2" />
					<p class="focus:outline-none text-sm">Manage</p>
				</button>
				<button class="text-gray5 dark:text-gray3 py-2 text-sm flex flex-row items-center" @click="toggleSharePopup">
					<LinkIcon class="h-5 w-5 mr-2" style="padding: 0.1em" />
					<p class="focus:outline-none text-sm">Share</p>
				</button>
				<button class="text-negative py-2 text-sm flex flex-row items-center" @click="toggleConfirmDelete">
					<BinIcon class="h-5 w-5 mr-2" style="padding: 0.1em" />
					<p class="focus:outline-none text-sm">Remove</p>
				</button>
			</div>
		</div>
	</div>
</template>
