<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/store/session';
import { Tag } from '@/backend/post';
import SimpleQuoteCard from '@/components/post/SimpleQuoteCard.vue';
import Avatar from '@/components/Avatar.vue';
import BrandedButton from '@/components/BrandedButton.vue';
import XIcon from '@/components/icons/XIcon.vue';
import SendIcon from '@/components/icons/SendIcon.vue';

const emit = defineEmits([`close`, `stats`]);

const store = useStore();

const props = withDefaults(
	defineProps<{
		authorid: string;
		id: string;
		timestamp: number;
		wordcount: number;
		postimages: number;
		bookmarked: boolean;
		encrypted: boolean;
		title: string;
		subtitle?: string;
		excerpt: string;
		featuredphotocid: string;
		tags: Tag[];
	}>(),
	{
		subtitle: null,
	},
);
const quoteContent = ref<string>(``);
const replyInputHeight = ref<number>(64);

function handleSendRepost() {
	if (quoteContent.value !== ``) {
		emit(`close`);
	}
	return;
}

function handleResize(e: any) {
	if (e.srcElement.clientHeight !== e.srcElement.scrollHeight) {
		replyInputHeight.value = e.srcElement.scrollHeight;
	}
}
</script>

<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Inner card area -->
		<div
			class="popup lg:min-h-40 w-full lg:w-748 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg shadow-lg px-6 py-5"
		>
			<!-- Quote input -->
			<div class="flex items-start flex-row lg:pb-4">
				<Avatar :authorid="store.$state.id" :avatar="store.$state.avatar" class="flex-shrink-0" />
				<textarea
					ref="repostText"
					v-model="quoteContent"
					class="focus:outline-none ml-4 mt-2 pr-8 w-full bg-transparent placeholder-gray5 dark:placeholder-gray3 dark:text-darkPrimaryText"
					placeholder="What's your response?"
					style="resize: none"
					:style="`height:` + replyInputHeight + `px`"
					@keydown="handleResize"
				></textarea>
				<button
					class="bg-gray1 dark:bg-gray5 focus:outline-none right-0 top-0 ml-0 rounded-full p-1 lg:ml-4"
					@click="emit(`close`)"
				>
					<XIcon />
				</button>
			</div>
			<!-- Quoted post with post summary -->
			<SimpleQuoteCard
				:id="props.id"
				:authorid="props.authorid"
				:timestamp="props.timestamp"
				:wordcount="props.wordcount"
				:postimages="props.postimages"
				:bookmarked="props.bookmarked"
				:encrypted="props.encrypted"
				:title="props.title"
				:subtitle="props.subtitle"
				:excerpt="props.excerpt"
				:featuredphotocid="props.featuredphotocid"
				:tags="props.tags"
				class="hidden lg:block"
				@close="emit(`close`)"
			/>
			<!-- Quote button -->
			<div
				class="flex flex-row-reverse pt-4"
				:class="quoteContent !== `` ? '' : 'opacity-50'"
				style="transition: all 0.4s"
			>
				<button
					class="bg-primary focus:outline-none block rounded-lg lg:hidden"
					style="margin-right: 15.2px; margin-bottom: 15px"
					@click="handleSendRepost"
				>
					<SendIcon class="m-2 mb-3 ml-3 h-5 w-5 text-darkPrimaryText transform rotate-45" />
				</button>
				<BrandedButton :action="handleSendRepost" :text="`Quote`" class="hidden lg:block" />
			</div>
		</div>
	</div>
</template>
