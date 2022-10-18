import { defineStore } from 'pinia';
import type { Post, Tag } from '@/backend/post';
import { useStore } from '@/store/session';

export interface DraftPost extends Post {
	accessTiers: Array<string>;
}

export interface DraftStore {
	drafts: DraftPost[];
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
		getDraftIndex: (state: DraftStore) => (draft: DraftPost) => {
			return state.drafts.indexOf(draft);
		},
		getDraftTags: (state: DraftStore) => {
			return state.drafts[state.activeIndex].tags;
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
			const blank: DraftPost = {
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
				encrypted: false,
				accessTiers: [],
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
		addTag(tag: string) {
			this.drafts[this.activeIndex].tags.push({ name: tag });
		},
		removeTag(tag: Tag) {
			const i = this.drafts[this.activeIndex].tags.indexOf(tag);
			if (i > -1) {
				this.drafts[this.activeIndex].tags.splice(i, 1);
			}
		},
		changeCategory(c: string) {
			this.drafts[this.activeIndex].category = c;
		},
		updateFeaturedPhotoCID(cid: string | null) {
			this.drafts[this.activeIndex].featuredPhotoCID = cid;
		},
		updateFeaturedPhotoCaption(caption: string | null) {
			this.drafts[this.activeIndex].featuredPhotoCaption = caption;
		},
		toggleEncrypted() {
			this.drafts[this.activeIndex].encrypted = !this.drafts[this.activeIndex].encrypted;
		},
		addTier(t: string) {
			this.drafts[this.activeIndex].accessTiers.push(t);
		},
		removeTier(t: string) {
			const i = this.drafts[this.activeIndex].accessTiers.indexOf(t);
			this.drafts[this.activeIndex].accessTiers.splice(i, 1);
		},
		updateContent(c: string, index: number) {
			this.drafts[index].content = c;
		},
	},
});
