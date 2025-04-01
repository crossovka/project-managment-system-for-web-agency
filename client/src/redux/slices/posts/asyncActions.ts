import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
import { getErrorMessage } from '@/libs/utils/getErrorMessage';
import { IPost } from './types';

// Получение всех постов
export const fetchPosts = createAsyncThunk<
	IPost[],
	void,
	{ dispatch: AppDispatch; state: RootState }
>('post/fetchPosts', async (_, { rejectWithValue, dispatch, getState }) => {
	const client = apiClient(dispatch, getState);
	try {
		const { data } = await client.get('posts');
		// console.log(`posts ${data}`);
		return data;
	} catch (error) {
		toast.error('Ошибка загрузки постов');
		return rejectWithValue(getErrorMessage(error));
	}
});

// Получение одного поста по postId
export const fetchPostById = createAsyncThunk<
	IPost,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'post/fetchPostById',
	async (postId: number, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.get(`posts/${postId}`);
			// console.log(data)
			return data;
		} catch (error) {
			toast.error('Ошибка загрузки поста');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Создание поста
export const createPost = createAsyncThunk<
	IPost,
	IPost,
	{ dispatch: AppDispatch; state: RootState }
>(
	'post/createPost',
	async (postData: IPost, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.post('posts', postData);
			dispatch(fetchPosts());
			return data.post;
		} catch (error) {
			toast.error('Ошибка создания поста');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Обновление поста
export const updatePost = createAsyncThunk<
	IPost,
	IPost,
	{ dispatch: AppDispatch; state: RootState }
>(
	'post/updatePost',
	async (postData: IPost, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		console.log('updatePost called with:', postData);
		try {
			const { data } = await client.put(`posts/${postData.post_id}`, postData);
			console.log('updatePost success:', data.post);
			return data;
		} catch (error) {
			toast.error('Ошибка обновления поста');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Удаление поста
export const deletePost = createAsyncThunk<
	number,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'post/deletePost',
	async (id: number, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			await client.delete(`posts/${id}`);
			return id;
		} catch (error) {
			toast.error('Ошибка удаления поста');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);
