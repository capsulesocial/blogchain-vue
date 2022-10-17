import { defineStore } from 'pinia';
import {
	createEncryptedPost,
	createRegularPost,
	IEncryptedPost,
	IRegularPost,
	Post,
	sendEncryptedPost,
	sendRegularPost,
	Tag,
} from '@/backend/post';
import { useStore } from '@/store/session';
import { EditorImages } from '@/components/Editor/helpers';
import { handleError, toastError } from '@/plugins/toast';
import turndownService from '@/components/Editor/TurndownService';
import { qualityContent, qualityFeaturedPhotoCaption, qualitySubtitle, qualityTitle } from '@/plugins/quality';
import { createEditorImageSet, isError } from '@/components/Editor/helpers';
import textLimits from '@/backend/utilities/text_limits';
import router from '@/router';

export interface DraftPost extends Post {
	accessTiers: Array<string>;
	wordCount: number;
	editorImageKeys: EditorImages;
}

export interface DraftStore {
	drafts: DraftPost[];
	activeIndex: number;
	draftWidget: boolean;
	hasPosted: boolean;
}

export const useDraftStore = defineStore(`draftStore`, {
	state: (): DraftStore => {
		return {
			drafts: [],
			activeIndex: 0,
			draftWidget: false,
			hasPosted: false,
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
		checkPost: (state: DraftStore): boolean => {
			const post = state.drafts[state.activeIndex];
			// Check for tiers on premium post
			if (post.encrypted && post.accessTiers.length === 0) {
				toastError(`At least one subscription tier must be selected`);
				return false;
			}
			// Check for quality title
			const titleCheck = qualityTitle(post.title);
			if (isError(titleCheck)) {
				toastError(titleCheck.error);
				return false;
			}
			// Check for subtitle on encrypted posts
			if (post.encrypted && (post.subtitle === `` || !post.subtitle)) {
				toastError(`Subtitles are required on encrypted premium posts`);
				return false;
			}
			// Check if using a subtitle and is a quality subtitle
			if (post.subtitle) {
				const subtitleCheck = qualitySubtitle(post.subtitle);
				if (isError(subtitleCheck)) {
					toastError(subtitleCheck.error);
					return false;
				}
			}
			// Check for quality featuredPhotoCaption
			if (post.featuredPhotoCaption) {
				const featuredPhotoCaptionCheck = qualityFeaturedPhotoCaption(post.featuredPhotoCaption);
				if (isError(featuredPhotoCaptionCheck)) {
					toastError(featuredPhotoCaptionCheck.error);
					return false;
				}
			}
			// Check category
			if (post.category === ``) {
				toastError(`Missing category`);
				return false;
			}
			// Check tags
			for (const { name } of post.tags) {
				if (name.replace(/\s/, ``).trim() !== name) {
					toastError(`Tag with spaces is not allowed`);
					return false;
				}
			}
			// Check content quality
			const clean = turndownService.turndown(post.content);
			const contentQualityCheck = qualityContent(clean);
			if (isError(contentQualityCheck)) {
				toastError(contentQualityCheck.error);
				return false;
			}
			if (state.hasPosted) {
				return false;
			}
			const postImages = createEditorImageSet(clean, allPostImages);
			if (postImages.size > textLimits.post_images.max) {
				toastError(`Cannot add more than ${textLimits.post_images.max} images in a post`);
				return false;
			}
			return true;
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
		async sendPost() {
			const post = this.drafts[this.activeIndex];
			// Send encrypted post
			const clean = turndownService.turndown(post.content);
			if (post.encrypted) {
				// quality rules
				if (!post.subtitle) {
					toastError(`Subtitle required on encrypted posts`);
					return;
				}
				const p: IEncryptedPost = createEncryptedPost(
					post.title,
					post.subtitle,
					clean,
					post.category,
					post.tags,
					post.authorID,
					post.featuredPhotoCID,
					post.featuredPhotoCaption,
					post.postImages,
				);
				try {
					const tiers: string[] = this.drafts[this.activeIndex].accessTiers;
					const postImages = this.drafts[this.activeIndex].postImages;
					// const postImages: string[] = [];
					const cid: string = await sendEncryptedPost(p, tiers, postImages);
					router.push(`/post/` + cid);
				} catch (err: unknown) {
					handleError(err);
				} finally {
					this.deleteDraft(this.activeIndex);
				}
				return;
			}
			// Send unencrypted post
			const p: IRegularPost = createRegularPost(
				post.title,
				post.subtitle === `` ? null : post.subtitle,
				clean,
				post.category,
				post.tags,
				post.authorID,
				post.featuredPhotoCID,
				post.featuredPhotoCaption,
				post.images,
			);
			try {
				this.hasPosted = true;
				const cid: string = await sendRegularPost(p);
				router.push(`/post/` + cid);
			} catch (err: unknown) {
				this.hasPosted = false;
				handleError(err);
			}
		},
	},
});
