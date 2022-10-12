<script setup lang="ts">
import { toastError } from '@/plugins/toast';
import { useDraftStore } from '@/store/drafts';
import { usePaymentsStore } from '@/store/paymentProfile';
import { useStore } from '@/store/session';
import { computed } from 'vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import CircleCheck from '@/components/icons/CheckCircle.vue';

const emit = defineEmits([`close`]);

const store = useStore();
const draftStore = useDraftStore();
const paymentStore = usePaymentsStore();

const tiers = computed(() => paymentStore.paymentProfile(store.$state.id).tiers);

function handleClose() {
	if (draftStore.drafts[draftStore.activeIndex].accessTiers.length > 0) {
		emit(`close`);
		return;
	}
	const postImages = draftStore.drafts[draftStore.activeIndex]?.postImages;
	if (postImages && postImages.length > 0) {
		toastError(`You must select at least one tier`);
		return;
	}
	if (draftStore.drafts[draftStore.activeIndex].accessTiers.length === 0) {
		draftStore.toggleEncrypted();
		emit(`close`);
	}
}

function addTier(tier: string) {
	draftStore.addTier(tier);
}
function removeTier(tier: string) {
	draftStore.removeTier(tier);
}
function save() {
	if (draftStore.drafts[draftStore.activeIndex].accessTiers.length < 1) {
		toastError(`you must select at least one Tier of subscription to make this post premium`);
		return;
	}
	emit(`close`);
}
</script>

<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="handleClose"
	>
		<!-- Container -->
		<section class="popup">
			<div
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">
						Manage access to this post
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="handleClose">
						<CloseIcon />
					</button>
				</div>
				<p class="text-gray5 dark:text-gray3 mt-6">Subscribers to:</p>
				<!-- Tier list -->
				<div class="flex flex-col mt-2">
					<button
						v-for="t in tiers"
						:key="t._id"
						class="bg-lightBG dark:bg-darkBG shadow-sm border rounded-lg w-full flex flex-row justify-between items-center p-5 my-2 transition duration-500 ease-in-out"
						:class="
							draftStore.drafts[draftStore.activeIndex].accessTiers.includes(t._id)
								? `border-neutral`
								: `border-lightBorder`
						"
						@click="
							draftStore.drafts[draftStore.activeIndex].accessTiers.includes(t._id) ? removeTier(t._id) : addTier(t._id)
						"
					>
						<div class="flex items-center">
							<CircleCheck
								:is-checked="draftStore.drafts[draftStore.activeIndex].accessTiers.includes(t._id)"
								class="text-neutral w-6 h-6 flex items-center transition duration-500 ease-in-out"
							/>
							<h2 class="font-semibold ml-4 text-xl text-lightPrimaryText dark:text-darkPrimaryText">{{ t.name }}</h2>
						</div>
						<p class="transition duration-500 ease-in-out text-gray5 dark:text-gray3">
							{{
								draftStore.drafts[draftStore.activeIndex].accessTiers.includes(t._id)
									? `Can see this post`
									: `Cannot see this post`
							}}
						</p>
					</button>
				</div>
				<div class="flex justify-end w-full">
					<button
						class="px-6 py-2 rounded-lg bg-neutral focus:outline-none text-white my-3 font-semibold"
						:class="draftStore.drafts[draftStore.activeIndex].accessTiers.length < 1 ? `opacity-50` : ``"
						@click="save"
					>
						Save
					</button>
				</div>
			</div>
		</section>
	</div>
</template>
