import { defineStore } from 'pinia';
import type { Post } from '@/backend/post';
import { useStore } from '@/store/session';

export interface DraftStore {
	drafts: Post[];
	activeIndex: number;
}

export const useDraftStore = defineStore(`draftStore`, {
	state: (): DraftStore => {
		return {
			drafts: [],
			activeIndex: 0,
		};
	},
	persist: true,
	getters: {
		getActiveDraft: (state: DraftStore) => {
			return state.drafts[state.activeIndex];
		},
		getDraftIndex: (state: DraftStore) => (draft: Post) => {
			return state.drafts.indexOf(draft);
		},
	},
	actions: {
		setActiveDraft(index: number) {
			this.activeIndex = index;
		},
		deleteDraft(index: number) {
			this.drafts.splice(index, 1);
			this.activeIndex = this.drafts.length;
		},
		createNewDraft() {
			const date = new Date().getTime();
			const blank: Post = {
				authorID: useStore().$state.id,
				title: ``,
				subtitle: ``,
				content: ``,
				category: ``,
				tags: [],
				featuredPhotoCID: null,
				featuredPhotoCaption: null,
				postImages: [],
				timestamp: date,
			};
			this.drafts.push(blank);
			this.activeIndex = this.drafts.indexOf(blank);
		},
		setTitle(title: string) {
			this.drafts[this.activeIndex].title = title;
		},
		setSubtitle(subtitle: string) {
			this.drafts[this.activeIndex].subtitle = subtitle;
		},
	},
});
