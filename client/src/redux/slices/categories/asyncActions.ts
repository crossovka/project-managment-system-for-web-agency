import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
import { ICategory } from './types';

// Получение всех категорий
export const fetchCategories = createAsyncThunk<
	ICategory[],
	void,
	{ dispatch: AppDispatch; state: RootState }
>(
	'category/fetchCategories',
	async (_, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.get('categories');
			console.log(`categories ${data}`)
			return data;
		} catch (error) {
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка загрузки категорий';
			return rejectWithValue(errorMessage);
		}
	}
);

// Создание категории
export const createCategory = createAsyncThunk<
	ICategory,
	ICategory,
	{ dispatch: AppDispatch; state: RootState }
>(
	'category/createCategory',
	async (categoryData: ICategory, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.post('categories', categoryData);
			dispatch(fetchCategories());
			return data.category;
		} catch (error) {
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка создания категории';
			return rejectWithValue(errorMessage);
		}
	}
);

// Обновление категории
export const updateCategory = createAsyncThunk<
	ICategory,
	{ id: number; categoryData: ICategory },
	{ dispatch: AppDispatch; state: RootState }
>(
	'category/updateCategory',
	async (
		{ id, categoryData }: { id: number; categoryData: ICategory },
		{ rejectWithValue, dispatch, getState }
	) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.put(`categories/${id}`, categoryData);
			return data.category;
		} catch (error) {
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка обновления категории';
			return rejectWithValue(errorMessage);
		}
	}
);

// Удаление категории
export const deleteCategory = createAsyncThunk<
	number,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'category/deleteCategory',
	async (id: number, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			await client.delete(`categories/${id}`);
			return id;
		} catch (error) {
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка удаления категории';
			return rejectWithValue(errorMessage);
		}
	}
);
