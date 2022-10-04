<script setup lang="ts">
import { ref } from 'vue';
import { emotionCategories, EmotionCategories } from '@/config/config';
import { faceGroupings, IFace } from '@/config/faces';
import { useStore } from '@/store/session';
import { useStoreSettings } from '@/store/settings';
import { useCommentsStore } from '@/store/comments';
import { toastWarning, toastError, handleError } from '@/plugins/toast';
import Avatar from '@/components/Avatar.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import SendIcon from '@/components/icons/SendIcon.vue';
import BrandedButton from '@/components/BrandedButton.vue';
import { qualityComment } from '@/plugins/quality';
import { isError } from '@/plugins/helpers';
import { createComment } from '@/backend/comment';

const store = useStore();
const settings = useStoreSettings();
const commentsStore = useCommentsStore();

const props = withDefaults(
	defineProps<{
		commentsCount: number;
		parentcid: string;
	}>(),
	{},
);

const showEmotions = ref<boolean>(false);
const selectedEmotionColor = ref<EmotionCategories | `neutralLightest`>(`neutralLightest`);
const selectedEmotion = ref<IFace | null>(null);
const activeEmotion = ref<IFace | null>(null);
const comment = ref<string>(``);

function sleep(ms: any) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function toggleShowEmotions() {
	showEmotions.value = !showEmotions.value;
	if (props.commentsCount === 0) {
		await sleep(100);
	}
	const body = document.getElementById(`faceSelector`);
	if (!body) {
		return;
	}
	body.scrollIntoView({ block: `center` });
}

function setEmotion(e: EventTarget | null, r: IFace) {
	if (!e) {
		return;
	}
	if (r.label === 'default') {
		return;
	}
	const target = e as HTMLElement;
	target.scrollIntoView({ behavior: `smooth`, block: `center` });
	selectedEmotion.value = r;
	if (emotionCategories.positive.has(r.label)) {
		selectedEmotionColor.value = `positive`;
		return;
	}
	if (emotionCategories.negative.has(r.label)) {
		selectedEmotionColor.value = `negative`;
		return;
	}

	selectedEmotionColor.value = `neutral`;
}

function confirmEmotion() {
	if (!selectedEmotion.value) {
		toastWarning(`No face selected!`);
		return;
	}
	activeEmotion.value = selectedEmotion.value;
	showEmotions.value = false;
}

function cancelEmotion() {
	showEmotions.value = false;
	selectedEmotionColor.value = `neutralLightest`;
	selectedEmotion.value = null;
}

async function sendComment() {
	// Check quality
	if (!activeEmotion.value || !selectedEmotion.value) {
		toastError(`You must select a reaction before posting`);
		return;
	}
	if (selectedEmotion.value.label === 'default') {
		toastError(`You must select a reaction before posting`);
		return;
	}
	comment.value = comment.value.trim();
	const commentQuality = qualityComment(comment.value);
	if (isError(commentQuality)) {
		toastError(commentQuality.error);
		return;
	}
	// send comment request
	try {
		const c = createComment(store.$state.id, comment.value, selectedEmotion.value.label, props.parentcid);
		await commentsStore.sendResponse(c, `comment`);
	} catch (err) {
		handleError(err);
	} finally {
		comment.value = ``;
		selectedEmotion.value = null;
		activeEmotion.value = null;
	}
}
</script>

<template>
	<div class="py-4">
		<!-- Top overlay with selector -->
		<div v-show="showEmotions" class="relative flex w-full flex-row-reverse">
			<div
				class="z-10 mr-1 hidden lg:flex flex-row justify-between rounded-tr-lg bg-lightBG dark:bg-darkBG p-5 lg:w-3/5"
				style="margin-bottom: -112px; margin-top: 1px; pointer-events: none"
			>
				<h6 class="text-lightPrimaryText dark:text-darkPrimaryText self-center text-center text-2xl font-semibold">
					How do you feel?
				</h6>
			</div>
			<div class="absolute z-20 mt-8 lg:mt-10 mr-8 flex items-center">
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="cancelEmotion()">
					<CloseIcon />
				</button>
			</div>
			<div
				class="z-10 flex flex-row justify-between rounded-tl-lg bg-gradient-to-b from-lightBG dark:from-darkBG to-transparent p-5 w-full lg:w-2/5 mr-1 lg:mr-0"
				style="margin-bottom: -112px; pointer-events: none; margin-top: 1px; margin-left: 1px"
			></div>
		</div>
		<div class="flex flex-col items-start lg:flex-row">
			<!-- Comment box Container -->
			<div
				v-show="!showEmotions"
				class="mr-4 hidden items-start justify-between lg:flex"
				style="width: 60px; height: 60px"
			>
				<Avatar
					:cid="store.$state.id === `` ? require(`@/assets/images/avatars/unauthenticated.webp`) : store.$state.avatar"
					:override="store.$state.id === `` ? require(`@/assets/images/avatars/unauthenticated.webp`) : null"
					:authorid="store.$state.id"
					class="flex-shrink-0"
					:no-click="true"
					:size="`h-12 w-12`"
				/>
			</div>
			<div
				id="faceSelector"
				class="border-lightBorder flex w-full overflow-hidden rounded-xl border"
				:class="
					showEmotions
						? ``
						: (selectedEmotionColor === `positive` ||
								selectedEmotionColor === `neutral` ||
								selectedEmotionColor === `negative`) &&
						  selectedEmotion
						? `border p-2 bg-` + selectedEmotionColor
						: `p-2 bg-lightBG dark:bg-darkBG`
				"
			>
				<div
					class="flex w-full items-center justify-center overflow-hidden rounded-xl relative"
					:style="showEmotions ? `height: 20rem` : `height: 10rem`"
				>
					<div v-if="store.$state.id !== ``" class="flex w-full flex-row">
						<!-- Front side: Type comment -->
						<div v-show="!showEmotions" class="flex w-full bg-lightBG dark:bg-darkBG">
							<button class="focus:outline-none h-auto flex-shrink-0" @click="toggleShowEmotions">
								<span v-if="activeEmotion">
									<img
										:src="settings.isDarkMode ? activeEmotion.dark : activeEmotion.light"
										:alt="activeEmotion.label"
										class="object-contain w-24 h-24 lg:w-32 lg:h-32"
										style="transform: rotateY(180deg)"
									/>
								</span>
								<span v-else>
									<img
										:src="
											settings.isDarkMode
												? require(`@/assets/images/reactions/dark/confident.webp`)
												: require(`@/assets/images/reactions/light/confident.webp`)
										"
										:alt="`select an emotion`"
										class="transition duration-500 ease-in-out opacity-50 hover:opacity-100 w-24 h-24 lg:w-32 lg:h-32"
										style="transform: rotateY(180deg)"
								/></span>
							</button>
							<textarea
								v-if="props.commentsCount > 0"
								v-model="comment"
								class="focus:outline-none placeholder-gray5 dark:placeholder-gray3 dark:text-darkPrimaryText h-40 w-full resize-none overflow-y-auto mr-2 py-4 pl-2 leading-normal bg-transparent"
								name="body"
								placeholder="What's your response?"
							/>
							<textarea
								v-else
								v-model="comment"
								class="focus:outline-none placeholder-gray5 dark:placeholder-gray3 dark:text-darkPrimaryText h-40 w-full resize-none overflow-y-auto mr-2 py-4 pl-2 leading-normal bg-transparent"
								name="body"
								placeholder="Be the first one to comment on this post..."
							/>
							<span class="flex flex-col justify-end relative">
								<button
									class="bg-primary focus:outline-none block rounded-lg lg:hidden"
									style="margin-right: 15.2px; margin-bottom: 12px"
									:disabled="comment === '' && !activeEmotion"
									:class="comment !== '' && activeEmotion ? '' : 'opacity-50 cursor-not-allowed'"
									@click="sendComment"
								>
									<SendIcon class="m-2 mb-3 ml-3 h-5 w-5 text-white transform rotate-45" />
								</button>
								<BrandedButton
									style="margin-right: 15.2px; margin-bottom: 12px"
									text="Post"
									class="hidden lg:block"
									:action="sendComment"
									:thin="true"
									:disabled="comment === '' && !activeEmotion"
									:class="comment !== '' && activeEmotion ? '' : 'opacity-50 cursor-not-allowed'"
								/>
							</span>
						</div>
						<!-- Back side: Choose reaction -->
						<div
							v-show="showEmotions"
							ref="scrollContainer"
							class="modal-animation w-full overflow-y-scroll bg-lightBG dark:bg-darkBG px-4 lg:px-6 flex justify-center"
							style="height: 320px; scroll-snap-type: y mandatory; scroll-snap-stop: always"
						>
							<!-- Middle selector area -->
							<div
								class="absolute rounded-lg p-2 h-32 lg:h-24 mt-24 lg:mt-28"
								:class="
									selectedEmotionColor === `positive` ||
									selectedEmotionColor === `neutral` ||
									selectedEmotionColor === `negative`
										? `bg-opacity-25 bg-` + selectedEmotionColor
										: `bg-gray1 dark:bg-gray7`
								"
								style="width: 92%"
							></div>
							<!-- Faces grid -->
							<div class="relative w-full" style="padding-bottom: 120px; padding-top: 120px">
								<div
									v-for="row in faceGroupings"
									:key="row[0].label + row[1].label + row[2].label"
									class="relative flex w-full flex-row mb-2 lg:px-2 justify-between"
									style="scroll-snap-align: center"
								>
									<button
										v-for="face in row"
										:key="face.label"
										class="focus:outline-none outline-none rounded-lg border-2"
										:class="
											selectedEmotion && selectedEmotion.label === face.label
												? `border-` + selectedEmotionColor
												: `border-transparent`
										"
										style="transition: all 0.3s ease-in-out"
										@click="setEmotion($event.target, face)"
									>
										<img
											:src="settings.isDarkMode ? face.dark : face.light"
											:alt="face.label"
											class="h-20 w-20"
											style="transform: rotateY(180deg)"
										/>
										<p
											class="capitalize lg:hidden mt-1"
											:class="
												selectedEmotion && selectedEmotion.label === face.label
													? `font-bold text-` + selectedEmotionColor
													: `text-gray7 dark:text-gray3`
											"
										>
											{{ face.label.replace(/_/g, ' ') }}
										</p>
									</button>
									<div
										v-for="face in row"
										:key="face.label + face.label"
										class="face-tag hidden lg:flex flex-grow items-center justify-center"
									>
										<button
											class="focus:outline-none outline-none flex flex-grow items-center justify-center"
											:class="
												selectedEmotion && selectedEmotion.label === face.label
													? `font-bold text-` + selectedEmotionColor
													: `text-gray7 dark:text-gray3`
											"
											style="transition: all 0.3s ease-in-out"
											@click="setEmotion($event.target, face)"
										>
											<p class="capitalize">
												{{ face.label.replace(/_/g, ' ') }}
											</p>
										</button>
										<div class="bg-gray5 dark:bg-darkBG separator h-1 w-1 rounded-full"></div>
									</div>
								</div>
								<!-- Extra row for spacing -->
								<div class="w-full" style="height: 120px"></div>
							</div>
						</div>
					</div>
					<div v-else class="text-gray5 dark:text-gray3 pt-3 text-sm">
						<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
						to comment on this post and be part of the debate
					</div>
				</div>
			</div>
		</div>
		<!-- Bottom overlay with selector -->
		<div v-show="showEmotions" class="relative flex w-full flex-row-reverse">
			<div
				class="z-10 mr-1 hidden lg:flex flex-row-reverse items-end rounded-br-xl bg-lightBG dark:bg-darkBG p-5 lg:w-3/5"
				style="height: 111px; margin-top: -112px; margin-left: 10px; margin-bottom: 1px; pointer-events: none"
			></div>
			<button
				class="bg-primary focus:outline-none absolute bottom-0 right-0 z-20 mb-7 mr-7 rounded-lg px-6 py-2 text-white"
				@click="confirmEmotion"
			>
				Select
			</button>
			<div
				class="z-10 bg-gradient-to-t from-lightBG dark:from-darkBG to-transparent flex flex-row-reverse items-end rounded-bl-lg p-5 w-full mr-1 lg:mr-0 lg:w-80"
				style="height: 111px; margin-top: -112px; pointer-events: none; margin-bottom: 1px; margin-left: 1px"
			></div>
		</div>
	</div>
</template>
<style scoped>
.face-tag:last-child .separator {
	display: none;
}
.border-negative {
	border-color: #ee1f63;
}
.border-positive {
	border-color: #1f7dad;
}
.border-neutral {
	border-color: #f0b785;
}
</style>
