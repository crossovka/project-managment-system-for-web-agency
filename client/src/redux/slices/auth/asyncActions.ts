import axios from 'axios';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '@/redux/store';
import {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	setProfileLoading,
	setUserProfile,
	setEmployeeProfile,
	setCurrentUser,
} from './slice';
import { IEmployee, ILoginPayload } from './types';
import { apiClient } from '@/libs/utils/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const login =
	(payload: ILoginPayload) => async (dispatch: AppDispatch) => {
		dispatch(loginStart());
		try {
			// Отправляем запрос на авторизацию
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}auth/login`,
				payload,
				{ withCredentials: true }
			);

			// Сохраняем токен и обновляем состояние
			localStorage.setItem('token', data.token);
			dispatch(loginSuccess({ employee: data.user, token: data.token }));

			toast.success('Вы успешно вошли!');
		} catch (error: AxiosError | any) {
			const errorMessage =
				error.response?.data?.message || error.message || 'Ошибка входа';
			dispatch(loginFailure(errorMessage));
			toast.error(errorMessage);
		}
	};

export const fetchCurrentUserProfile = createAsyncThunk<
	IEmployee,
	void,
	{ dispatch: AppDispatch }
>('auth/fetchCurrentUserProfile', async (_, { dispatch, getState }) => {
	dispatch(setProfileLoading(true));

	try {
		const client = apiClient(dispatch, getState);
		const { data } = await client.get('auth/profile');

		dispatch(setCurrentUser(data));
		return data;
	} catch (error: AxiosError | any) {
		const errorMessage =
			error.response?.data?.message ||
			error.message ||
			'Ошибка загрузки профиля';
		toast.error(errorMessage);
		// dispatch(logout());
		throw error;
	} finally {
		dispatch(setProfileLoading(false));
	}
});

export const fetchEmployeeProfile = createAsyncThunk<
	IEmployee,
	number,
	{ dispatch: AppDispatch }
>(
	'auth/fetchEmployeeProfile',
	async (employeeId: number, { dispatch, getState }) => {
		dispatch(setProfileLoading(true));

		try {
			const client = apiClient(dispatch, getState);
			const { data } = await client.get(`auth/profile/${employeeId}`);

			dispatch(setEmployeeProfile(data));
			return data;
		} catch (error: AxiosError | any) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Ошибка загрузки профиля';
			toast.error(errorMessage);
			// dispatch(logout());
			throw error;
		} finally {
			dispatch(setProfileLoading(false));
		}
	}
);
