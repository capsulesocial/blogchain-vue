import { defineStore } from 'pinia';
import { getPosts, Algorithm, IPostResponse } from '@/backend/post';
import { handleError } from '@/plugins/toast';

export const useStoreTag = defineStore(`tags`, {
	state: () => {
		return {
			tagPosts: {},
		};
	},
	persist: true,
	actions: {
		async fetchPostswithTag(tag: string, id: string, sort: Algorithm, offset: number, limit: number): Promise<void> {
			try {
				const res: IPostResponse[] = await getPosts({ tag }, id, { sort, offset, limit });
				if (res) {
					this.$state.tagPosts = res;
					return;
				}
			} catch (error: any) {
				handleError(error);
			}
		},
	},
	getters: {},
});
