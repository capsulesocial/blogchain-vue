<script setup lang="ts">
import { ref } from 'vue';
import { useStoreSettings } from '@/store/settings';
import { faces, IFace } from '@/config/faces';
import type { Profile } from '@/backend/profile';
import { feelings } from '@/config/config';
import { formatDate } from '@/helpers/helpers';
import { useStore } from '@/store/session';
import { ICommentData } from '@/backend/comment';
import MoreIcon from '@/components/icons/MoreIcon.vue';
import BinIcon from '@/components/icons/BinIcon.vue';
import Reply from '@/components/post/comments/Reply.vue';

const settings = useStoreSettings();
const store = useStore();

// comment
const emotion = ref<IFace>(faces.sad);
const showLabel = ref<boolean>(false);
const content = ref<string>(`this is a default comment`);
const replies = ref<ICommentData[]>([
	{
		authorID: `jackistesting`,
		_id: `szfkbjkaaefonqnef`,
		timestamp: 13047013,
		parentCID: `aepfjanfoeaofae`,
		emotion: `admiration`,
	},
	{
		authorID: `jackistesting`,
		_id: `aekjfaofneofnoao`,
		timestamp: 13047013,
		parentCID: `aepfjanfoeaofae`,
		emotion: `admiration`,
	},
]);
// todo: regroup those 2 into a fetched post of type IGenericPostResponse
const postAuthor = ref<string>(`jackistesting`);
const timestamp = ref<number>(13392);
// --
const commentAuthor = ref<Profile>({
	id: `jackistesting`,
	name: `Jack Dishman`,
	email: `tb12@gmail.com`,
	bio: `6-time super bowl champion`,
	location: `Tampa Bay`,
	avatar: ``,
	socials: [],
	website: `tb12.com`,
});

const showReplies = ref<boolean>(false);
const showDelete = ref<boolean>(false);
const commentDeleted = ref<boolean>(false);

// replies
const reply = ref<string>(``);
const replyInputHeight = ref<number>(64);

function handleResize(e: any) {
	if (e.srcElement.clientHeight !== e.srcElement.scrollHeight) {
		replyInputHeight.value = e.srcElement.scrollHeight;
	}
}

function filterReplies(): ICommentData[] {
	return replies.value.sort((p0, p1) => p0.timestamp - p1.timestamp);
}

function toggleDropdownDelete() {
	showDelete.value = !showDelete.value;
}
</script>

<template>
	<div v-show="!commentDeleted" class="object-contain">
		<div class="mt-2 flex w-full">
			<!-- Desktop avatar -->
			<div class="mr-4 hidden items-start justify-between lg:flex">
				<!-- <Avatar
				:avatar="avatar"
				:author-i-d="authorID"
				size="w-12 h-12"
				style="margin-top: 2px; margin-left: 2px; margin-right: 2px"
			/> -->
				<div class="w-10 h-10 rounded-lg bg-gray1 animate-pulse hidden lg:flex"></div>
			</div>
			<div class="flex flex-col w-full">
				<!-- Comment -->
				<div
					class="relative flex flex-row w-full overflow-x-auto justify-between rounded-lg bg-opacity-5"
					:class="
						feelings.positive.has(emotion.label)
							? `bg-positive`
							: feelings.negative.has(emotion.label)
							? `bg-negative`
							: `bg-neutral`
					"
				>
					<div class="flex w-full flex-grow flex-col px-4 py-2">
						<!-- Top row: name, id, timestamp -->
						<div class="flex items-center flex-wrap">
							<router-link :to="`/id/` + commentAuthor.id" class="mr-3 flex items-center lg:mb-0 mb-2">
								<!-- <Avatar :avatar="avatar" :author-i-d="authorID" size="w-8 h-8" class="mr-2 flex-shrink-0 lg:hidden" /> -->
								<div class="w-8 h-8 rounded-lg bg-gray1 animate-pulse lg:hidden mr-2"></div>
								<span v-if="commentAuthor.name != ``" class="font-semibold dark:text-darkPrimaryText">
									{{ commentAuthor.name }}
								</span>
								<span v-else class="text-gray5 dark:text-gray3 font-semibold">{{ commentAuthor.id }}</span>
								<span class="text-gray5 dark:text-gray3 ml-2 text-sm"> @{{ commentAuthor.id }} </span>
								<span
									v-if="commentAuthor.id === postAuthor"
									class="bg-gray1 dark:bg-lightBG dark:text-darkPrimaryText ml-2 rounded-2xl dark:bg-opacity-25 py-1 px-2 text-xs"
								>
									Author
								</span>
							</router-link>
							<div class="h-1 w-1 bg-gray5 mr-2 rounded-xl"></div>
							<span v-if="timestamp" class="self-center text-xs dark:text-gray3 mb-2 lg:mt-2">
								{{ formatDate(timestamp) }}
							</span>
						</div>
						<!-- Content -->
						<div class="flex">
							<div class="flex flex-grow flex-col overflow-hidden">
								<div class="w-full">
									<!-- Reaction face image -->
									<div class="flex float-right flex-shrink-0 items-center justify-center overflow-hidden">
										<img
											:src="settings.isDarkMode ? emotion.dark : emotion.light"
											class="-mb-1 mt-2 h-24 w-24 bg-transparent"
											:class="emotion.label === `default` ? `animate-pulse` : ``"
											:style="emotion.label === `default` ? `filter: blur(5px)` : ``"
											@mouseover="showLabel = true"
											@mouseleave="showLabel = false"
										/>
										<div
											v-show="showLabel"
											class="border-lightBorder modal-animation-delay absolute top-0 mt-2 z-40 flex flex-col rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg"
										>
											<p class="text-sm text-gray5 dark:text-gray3">
												{{ emotion.label.replace(/_/g, ' ') }}
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
											v-if="replies.length === 1"
											class="text-gray5 dark:text-gray3 focus:outline-none text-left font-sans text-sm ml-4 cursor-pointer"
											@click="showReplies = !showReplies"
										>
											{{ replies.length }} Reply
										</p>
										<p
											v-else
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
						v-if="store.$state.id === commentAuthor.id || store.$state.id === postAuthor"
						class="focus:outline-none absolute top-0 right-0 flex-col justify-start text-gray5 dark:text-gray3 pt-2 pr-3"
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
						<button class="focus:outline-none text-negative flex">
							<BinIcon class="w-4 h-4" />
							<span class="text-negative self-center text-xs ml-1 mr-1">Remove this comment</span>
						</button>
					</div>
				</div>
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
							<button v-if="reply !== ''" class="text-primary focus:outline-none text-left font-sans text-sm p-4">
								Post reply
							</button>
						</span>
					</div>
					<div v-else class="text-gray5 dark:text-gray3 p-4 text-sm bg-lightBG dark:bg-darkBG rounded-lg mb-4">
						<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
						to reply to this comment and be part of the debate
					</div>
					<!-- List replies -->
					<div v-if="filterReplies().length > 0" class="pl-5 mt-2">
						<Reply
							v-for="r in filterReplies()"
							:key="r._id"
							:commenter-i-d="commentAuthor.id"
							:author-i-d="r.authorID"
							:cid="r._id"
							:timestamp="r.timestamp"
							class="pt-1 mt-2"
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
