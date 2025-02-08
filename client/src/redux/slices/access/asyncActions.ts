// asyncActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
import { IAccess } from './types';

// Fetch accesses by project ID
// export const fetchAccessesByProjectId = createAsyncThunk<
// 	IAccess[],
// 	number,
// 	{ dispatch: AppDispatch; state: RootState }
// >(
// 	'access/fetchByProjectId',
// 	async (projectId, { rejectWithValue, dispatch, getState }) => {
// 		const client = apiClient(dispatch, getState);

// 		try {
// 			const { data } = await client.get(`/access/${projectId}`);
// 			return data;
// 		} catch (error) {
// 			toast.error('Ошибка загрузки доступов');
// 			return rejectWithValue(
// 				(error as AxiosError)?.response?.data?.message ||
// 					'Ошибка загрузки доступов'
// 			);
// 		}
// 	}
// );

// Create a new access
export const createAccess = createAsyncThunk<
	IAccess,
	{
		resourceName: string;
		login: string;
		password: string;
		projectId: number;
	},
	{ dispatch: AppDispatch; state: RootState }
>(
	'access/create',
	async (newAccess, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.post('/access', newAccess);
			toast.success('Доступ успешно создан');
			return data;
		} catch (error) {
			toast.error('Ошибка создания доступа');
			return rejectWithValue(
				(error as AxiosError)?.response?.data?.message ||
					'Ошибка создания доступа'
			);
		}
	}
);

// Update an existing access
export const updateAccess = createAsyncThunk<
	IAccess, // Тип возвращаемого объекта (обновленные данные доступа)
	{ accessId: number; updates: IAccess }, // Тип данных, передаваемых в экшен (accessId и обновления)
	{ dispatch: AppDispatch; state: RootState }
>(
	'access/update', // Название экшена
	async ({ accessId, updates }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			// Отправляем PATCH запрос с accessId в URL и обновлениями в теле запроса
			const { data } = await client.patch(`/access/${accessId}`, updates);

			toast.success('Доступ успешно обновлен');
			return data; // Возвращаем обновленные данные доступа
		} catch (error) {
			toast.error('Ошибка обновления доступа');
			// Возвращаем ошибку с сообщением, если запрос не удался
			return rejectWithValue(
				(error as AxiosError)?.response?.data?.message ||
					'Ошибка обновления доступа'
			);
		}
	}
);

// Delete an access
export const deleteAccess = createAsyncThunk<
	number,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'access/delete',
	async (accessId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			await client.delete(`/access/${accessId}`);
			toast.success('Доступ успешно удален');
			return accessId;
		} catch (error) {
			toast.error('Ошибка удаления доступа');
			return rejectWithValue(
				(error as AxiosError)?.response?.data?.message ||
					'Ошибка удаления доступа'
			);
		}
	}
);
