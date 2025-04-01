import axios from 'axios';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '@/redux/store';
import {
	loginStart,
	loginSuccess,
	loginFailure,
	setProfileLoading,
	setEmployeeProfile,
	setCurrentUser,
} from './slice';
import { IEmployee, ILoginPayload } from './types';
import { apiClient } from '@/libs/utils/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/libs/utils/getErrorMessage';

export const login =
	(payload: ILoginPayload) => async (dispatch: AppDispatch) => {
		dispatch(loginStart());
		try {
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}auth/login`,
				payload,
				{ withCredentials: true }
			);
			localStorage.setItem('token', data.token);
			dispatch(loginSuccess({ employee: data.user, token: data.token }));
			toast.success('Вы успешно вошли!');
		} catch (error) {
			dispatch(loginFailure(getErrorMessage(error)));
			toast.error('Ошибка входа');
		}
	};

export const fetchCurrentUserProfile = createAsyncThunk<
	IEmployee,
	void,
	{ dispatch: AppDispatch; state: RootState }
>(
	'auth/fetchCurrentUserProfile',
	async (_, { dispatch, getState, rejectWithValue }) => {
		dispatch(setProfileLoading(true));
		try {
			const client = apiClient(dispatch, getState);
			const { data } = await client.get('auth/profile');
			dispatch(setCurrentUser(data));
			return data;
		} catch (error) {
			toast.error('Ошибка загрузки профиля');
			return rejectWithValue(getErrorMessage(error));
		} finally {
			dispatch(setProfileLoading(false));
		}
	}
);

export const fetchEmployeeProfile = createAsyncThunk<
	IEmployee,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'auth/fetchEmployeeProfile',
	async (employeeId: number, { dispatch, getState, rejectWithValue }) => {
		dispatch(setProfileLoading(true));
		try {
			const client = apiClient(dispatch, getState);
			const { data } = await client.get(`auth/profile/${employeeId}`);
			dispatch(setEmployeeProfile(data));
			return data;
		} catch (error) {
			toast.error('Ошибка загрузки профиля');
			return rejectWithValue(getErrorMessage(error));
		} finally {
			dispatch(setProfileLoading(false));
		}
	}
);
