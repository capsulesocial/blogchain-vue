import { defineStore } from 'pinia';
import type { Post, Tag } from '@/backend/post';
import { useStore } from '@/store/session';
import { EditorImages } from '@/components/Editor/helpers';

export interface DraftPost extends Post {
	accessTiers: Array<string>;
	wordCount: number;
	editorImageKeys: EditorImages;
}

export interface DraftStore {
	drafts: DraftPost[];
	activeIndex: number;
	draftWidget: boolean;
}

export const useDraftStore = defineStore(`draftStore`, {
	state: (): DraftStore => {
		return {
			drafts: [],
			activeIndex: 0,
			draftWidget: false,
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
		getWordCount: (state: DraftStore) => {
			return state.drafts[state.activeIndex].wordCount - 2;
		},
		getActiveIndex: (state: DraftStore) => {
			return state.activeIndex;
		},
	},
	actions: {
		setActiveDraft(index: number) {
			this.activeIndex = index;
		},
		deleteDraft(index: number) {
			this.drafts.splice(index, 1);
			// deleting only draft
			if (this.drafts.length === 0) {
				this.createNewDraft();
				return;
			}
			this.activeIndex = this.drafts.length - 1;
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
				wordCount: 0,
				editorImageKeys: new Map(),
			};
			this.drafts.push(blank);
			this.activeIndex = this.drafts.indexOf(blank);
		},
		handleDraftWidget(v: boolean) {
			this.draftWidget = v;
		},
		setTitle(title: string) {
			this.drafts[this.activeIndex].title = title;
		},
		setSubtitle(subtitle: string) {
			this.drafts[this.activeIndex].subtitle = subtitle;
		},
		setTimestamp(timestamp: number) {
			this.drafts[this.activeIndex].timestamp = timestamp;
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
		updatePostImages(postImages?: string[]) {
			this.drafts[this.activeIndex].postImages = postImages;
		},
		updateEditorImageKeys(editorImageKeys: EditorImages) {
			this.drafts[this.activeIndex].editorImageKeys = editorImageKeys;
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
		updateWordCount(n: number) {
			this.drafts[this.activeIndex].wordCount = n;
		},
	},
});
