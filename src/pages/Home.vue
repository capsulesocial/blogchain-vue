<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/store/posts'
import { Algorithm, Timeframe, readableTimeframe } from '@/backend/post'
// refs
const showAlgorithmDropdown = ref<boolean>(false)
const postsStore = usePostsStore()
const { homeFeed, displayTimeframe, posts } = storeToRefs(postsStore)

onMounted(async () => {
	usePostsStore().fetchHomePosts()
	document.addEventListener(`click`, (e) => {
		// Dropdown is closed
		if (!showAlgorithmDropdown.value) {
			return
		}
		showAlgorithmDropdown.value = false
	})
})
</script>

<template>
	<div>
		<nav class="flex w-full flex-row justify-between text-sm rounded-t-lg">
			<div class="flex">
				<button
					:class="
						homeFeed.algorithm === Algorithm.FOLLOWING ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`
					"
					class="flex items-center focus:outline-none h-full w-full py-4 px-6"
					@click="postsStore.setAlgorithm(Algorithm.FOLLOWING)"
				>
					Following
				</button>
				<button
					:class="homeFeed.algorithm === Algorithm.NEW ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center px-6 focus:outline-none h-full w-full py-4"
					@click="postsStore.setAlgorithm(Algorithm.NEW)"
				>
					New
				</button>
				<button
					:class="homeFeed.algorithm === Algorithm.TOP ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center focus:outline-none h-full w-full py-4 px-6"
					@click="postsStore.setAlgorithm(Algorithm.TOP)"
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
						v-for="timeframe in [Timeframe.DAY, Timeframe.WEEK, Timeframe.MONTH, Timeframe.YEAR, Timeframe.ALL_TIME]"
						:key="timeframe"
						class="hotzone flex justify-start items-start flex-col dark:text-gray3"
					>
						<button
							:class="homeFeed.timeframe === timeframe ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
							class="hotzone focus:outline-none my-1 px-2 whitespace-nowrap"
							@click="postsStore.setTimeframe(timeframe)"
						>
							{{ readableTimeframe(timeframe) }}
						</button>
					</div>
				</div>
			</div>
		</nav>
		<!-- TODO: Following should be the post card component-->
		<div v-for="post in posts" class="border-2 p-1 b-1" :key="post.post._id">
			<b> {{ post.post.title }} </b>
			<br />
			<br />
			<p>{{ post.post.subtitle }}</p>
			<br />
		</div>
	</div>
</template>
