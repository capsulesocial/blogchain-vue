<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { faces } from '@/config/faces';
import { useStoreSettings } from '@/store/settings';
import { emotionCategories, Emotions } from '@/config/config';
import { formatDate } from '@/helpers/helpers';
import { useStore } from '@/store/session';
import BinIcon from '@/components/icons/BinIcon.vue';
import Reply from '@/components/post/comments/Reply.vue';
import Avatar from '@/components/Avatar.vue';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import { useCommentsStore } from '@/store/comments';
import { useProfilesStore } from '@/store/profiles';
import { qualityComment } from '@/plugins/quality';
import { isError } from '@/plugins/helpers';
import { toastError, handleError } from '@/plugins/toast';
import { createComment, getComment } from '@/backend/comment';
import { useRoute } from 'vue-router';

const commentsStore = useCommentsStore();
const settings = useStoreSettings();
const store = useStore();
const route = useRoute();
const profileStore = useProfilesStore();

const props = defineProps<{
	cid: string;
	authorid: string;
	timestamp: number;
	emotion: Emotions;
	parentcid: string;
	parentauthorid?: string;
}>();
// comment
const showLabel = ref(false);

const showReplies = ref(false);
const showDelete = ref(false);
const commentDeleted = ref(false);
const content = ref('');
const replies = computed(() => commentsStore.getCommentsOfPost(props.cid));
const author = computed(() => {
	if (typeof props.authorid !== `string`) {
		throw new Error(`authorID prop should be a string`);
	}
	return profileStore.getProfile(props.authorid);
});

// replies
const reply = ref(``);
const replyInputHeight = ref(64);

function handleResize(e: any) {
	if (e.srcElement.clientHeight !== e.srcElement.scrollHeight) {
		replyInputHeight.value = e.srcElement.scrollHeight;
	}
}

function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}

async function sendReply() {
	// Check quality
	reply.value = reply.value.trim();
	const commentQuality = qualityComment(reply.value);
	if (isError(commentQuality)) {
		toastError(commentQuality.error);
		return;
	}
	// Send comment request
	try {
		const c = createComment(store.$state.id, reply.value, `no-emotion`, props.cid);
		await commentsStore.sendResponse(c, `reply`);
	} catch (err) {
		handleError(err);
	} finally {
		reply.value = ``;
	}
}

async function removeComment() {
	try {
		await commentsStore.removeUserComment(props.cid, store.$state.id, props.parentcid);
	} catch (err) {
		handleError(err);
	} finally {
		showDelete.value = false;
		commentDeleted.value = true;
	}
}

async function updateReplies() {
	await commentsStore.fetchCommentsOfPost(props.cid);
}
onMounted(async () => {
	getComment(props.cid).then((c) => {
		content.value = c.content;
	});
	await commentsStore.fetchCommentsOfPost(props.cid);
	profileStore.fetchProfile(props.authorid);

	window.addEventListener(
		`click`,
		(e: any): void => {
			if (!e.target) {
				return;
			}
			if (
				e.target.parentNode === null ||
				e.target.parentNode.classList === undefined ||
				!e.target.parentNode.classList.contains(`toggleDelete`)
			) {
				showDelete.value = false;
			}
		},
		false,
	);
});
</script>

<template>
	<div v-show="!commentDeleted" class="object-contain">
		<div class="mt-2 flex w-full">
			<!-- Desktop avatar -->
			<div class="mr-4 hidden items-start justify-between lg:flex flex-shrink-0">
				<Avatar
					:cid="author.avatar"
					:authorid="author.id"
					size="w-12 h-12"
					style="margin-top: 2px; margin-left: 2px; margin-right: 2px"
				/>
				<div v-show="!author" class="w-10 h-10 rounded-lg bg-gray1 animate-pulse hidden lg:flex"></div>
			</div>
			<div class="flex flex-col w-full">
				<!-- Comment -->
				<div
					class="relative flex flex-row w-full overflow-x-auto justify-between rounded-lg bg-opacity-10"
					:class="
						emotionCategories.positive.has(props.emotion)
							? `bg-positive`
							: emotionCategories.negative.has(props.emotion)
							? `bg-negative`
							: `bg-neutral`
					"
				>
					<div class="flex w-full flex-grow flex-col px-4 py-2">
						<!-- Top row: name, id, timestamp -->
						<div class="flex items-center flex-wrap">
							<router-link :to="`/id/` + author.id" class="mr-3 flex items-center lg:mb-0 mb-2">
								<!-- <Avatar :avatar="avatar" :author-i-d="authorID" size="w-8 h-8" class="mr-2 flex-shrink-0 lg:hidden" /> -->
								<div class="w-8 h-8 rounded-lg bg-gray1 animate-pulse lg:hidden mr-2"></div>
								<span class="font-semibold dark:text-darkPrimaryText">
									{{ author.name != `` ? author.name : props.authorid }}
								</span>
								<span class="text-lightPrimaryText dark:text-darkPrimaryText ml-2 text-sm lg:text-base">
									@{{ props.authorid }}
								</span>
								<span
									v-if="props.authorid === props.parentauthorid"
									class="bg-gray1 dark:bg-lightBG dark:text-darkPrimaryText ml-2 rounded-2xl dark:bg-opacity-25 py-1 px-2 text-xs"
								>
									Author
								</span>
							</router-link>
							<span v-if="props.timestamp" class="self-center text-xs dark:text-gray3 mb-2 lg:mt-2">
								{{ formatDate(props.timestamp) }}
							</span>
						</div>
						<!-- Content -->
						<div class="flex">
							<div class="flex flex-grow flex-col overflow-hidden">
								<div class="w-full">
									<!-- Reaction face image -->
									<div class="flex float-right flex-shrink-0 items-center justify-center overflow-hidden">
										<img
											:src="settings.isDarkMode ? faces[props.emotion].dark : faces[props.emotion].light"
											class="-mb-1 mt-2 h-24 w-24 bg-transparent"
											:class="faces[props.emotion].label === `default` ? `animate-pulse` : ``"
											:style="faces[props.emotion].label === `default` ? `filter: blur(5px)` : ``"
											@mouseover="showLabel = true"
											@mouseleave="showLabel = false"
										/>
										<div
											v-show="showLabel"
											class="border-lightBorder modal-animation-delay absolute top-0 mt-2 z-40 flex flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg"
										>
											<p class="text-sm text-gray5 dark:text-gray3">
												{{ faces[props.emotion].label.replace(/_/g, ' ') }}
											</p>
										</div>
									</div>
									<!-- Text comment -->
									<p class="break-words w-4/5 py-1 mb-6 font-sans leading-relaxed dark:text-darkPrimaryText">
										<span style="white-space: pre-line">{{ content }}</span>
									</p>

									<!-- Reply button -->
									<div class="flex flex-row items-center absolute bottom-0 pb-3">
										<button
											class="text-primary focus:outline-none text-left font-sans text-sm"
											@click="showReplies = !showReplies"
										>
											Reply
										</button>
										<p
											v-if="replies && replies.length === 1"
											class="text-gray5 dark:text-gray3 focus:outline-none text-left font-sans text-sm ml-4 cursor-pointer"
											@click="showReplies = !showReplies"
										>
											{{ replies.length }} Reply
										</p>
										<p
											v-else-if="replies"
											class="text-gray5 dark:text-gray3 focus:outline-none text-left font-sans text-sm ml-4 cursor-pointer"
											@click="showReplies = !showReplies"
										>
											{{ replies.length }} Replies
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button
						v-if="store.$state.id === props.authorid"
						class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-2 pr-3 toggleDelete"
						@click.stop="toggleDropdownDelete"
					>
						<MoreIcon />
					</button>
					<div
						v-show="showDelete"
						class="border-lightBorder modal-animation absolute z-10 flex w-44 flex-col items-center rounded-lg border bg-lightBG dark:bg-darkBG p-1 shadow-lg"
						:class="settings.isDarkMode ? `dropdownDeleteOpenDark` : `dropdownDeleteOpen`"
						style="top: 40px; right: 0px"
					>
						<!-- Delete -->
						<button class="focus:outline-none text-negative flex" @click="removeComment()">
							<BinIcon class="w-4 h-4" />
							<span class="text-negative self-center text-xs ml-1 mr-1">Remove this comment</span>
						</button>
					</div>
				</div>
				<p v-if="route.name === `Comments`" class="mt-1 text-right">
					<router-link :to="`/post/` + props.parentcid" class="text-gray5 dark:text-gray3 text-xs"
						>View Post
					</router-link>
				</p>
				<!-- Replies -->
				<div v-if="showReplies" class="modal-animation mr-5 mt-4 border-l border-gray3 pl-2">
					<!-- Reply Input box -->
					<div
						v-if="store.$state.id !== ``"
						class="ml-5 flex w-full rounded-xl border-2 p-1 bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText border-lightBorder"
					>
						<textarea
							v-model="reply"
							rows="4"
							type="text"
							placeholder="Reply.."
							class="focus:outline-none w-4/5 overflow-hidden py-1 px-2 text-sm leading-normal bg-lightBG dark:bg-darkBG text-lightPrimaryText dark:text-darkPrimaryText"
							style="resize: none"
							:style="`height:` + replyInputHeight + `px`"
							@keydown="handleResize"
						>
						</textarea>
						<span class="relative w-1/5 flex justify-end items-end">
							<button
								v-if="reply !== ''"
								class="text-primary focus:outline-none text-left font-sans text-sm p-4"
								@click="sendReply"
							>
								Post reply
							</button>
						</span>
					</div>
					<div v-else class="text-gray5 dark:text-gray3 p-4 text-sm bg-lightBG dark:bg-darkBG rounded-lg mb-4">
						<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
						to reply to this comment and be part of the debate
					</div>
					<!-- List replies -->
					<div v-if="replies && replies?.length > 0" class="pl-5 mt-2">
						<Reply
							v-for="r in replies"
							:key="r._id"
							:cid="r._id"
							:authorid="r.authorID"
							:timestamp="r.timestamp"
							:parentcid="props.cid"
							@update-replies="updateReplies"
						/>
					</div>
				</div>
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
</style>
