<script setup lang="ts">
import { useDraftStore } from '@/store/drafts';
import HorizontalDraftPreview from '@/components/HorizontalDraftPreview.vue';
import SecondaryButton from '@/components/SecondaryButton.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import { computed } from 'vue';

const emit = defineEmits([`close`]);
const draftStore = useDraftStore();
const drafts = computed(() => draftStore.$state.drafts);

function handleClose() {
	emit(`close`);
}
</script>
<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="emit(`close`)"
	>
		<!-- Container -->
		<section>
			<div
				class="min-h-40 max-h-90 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation z-10 mr-5 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">Drafts</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div v-if="drafts.length === 0" class="flex w-full flex-col items-center mt-24">
					<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
						It seems you don't have any drafts yet, you can start a new one here:
					</p>
					<SecondaryButton
						:text="`Write a post`"
						:action="
							() => {
								draftStore.createNewDraft();
								$router.push(`/write`);
							}
						"
					/>
				</div>
				<div class="flex w-full flex-col-reverse items-center">
					<HorizontalDraftPreview
						v-for="draft in drafts"
						:key="draft.timestamp"
						:draft="draft"
						@close-drafts-popup="handleClose"
					/>
				</div>
			</div>
		</section>
	</div>
</template>
