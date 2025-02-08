import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
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
		const errorMessage =
			(error as AxiosError)?.response?.data?.message ||
			'Ошибка загрузки постов';
		return rejectWithValue(errorMessage);
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка загрузки поста';
			return rejectWithValue(errorMessage);
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка создания поста';
			return rejectWithValue(errorMessage);
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка обновления поста';
			console.error('updatePost error:', errorMessage);
			return rejectWithValue(errorMessage);
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка удаления поста';
			return rejectWithValue(errorMessage);
		}
	}
);
