import { RootState } from '@/redux/store';
import { IPost } from './types';

export const selectPosts = (state: RootState): IPost[] => state.post.posts;
export const selectPostLoading = (state: RootState): boolean => state.post.loading;
export const selectPostError = (state: RootState): string | null => state.post.error;
export const selectCurrentPost = (state: RootState): IPost | null => state.post.currentPost;
export const selectPostById = (state: RootState, postId: number): IPost | undefined => {return state.post.posts.find((post) => post.post_id === postId);};