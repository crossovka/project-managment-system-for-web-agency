import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import { AppDispatch, RootState } from '@/redux/store';

import { IProject, IProjectMinimal } from './types';
import { apiClient } from '@/libs/utils/apiClient';
import { IProjectStatus } from '@/types/common';
import { getErrorMessage } from '@/libs/utils/getErrorMessage';

export const fetchProjectById = createAsyncThunk<
	IProject,
	number,
	{ dispatch: AppDispatch; state: RootState }
>('project/fetchById', async (id, { rejectWithValue, dispatch, getState }) => {
	const client = apiClient(dispatch, getState);

	try {
		const { data } = await client.get(`projects/${id}`);
		// console.log(data)
		return data;
	} catch (error) {
		toast.error('Ошибка загрузки проекта');
		return rejectWithValue(getErrorMessage(error));
	}
});

export const fetchProjectNameById = createAsyncThunk<
	string, // The return type (project name)
	number, // The parameter type (project ID)
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/fetchNameById',
	async (id, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get(`projects/${id}/name`);
			return data;
		} catch (error) {
			toast.error('Ошибка загрузки имени проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Создание нового createAsyncThunk для получения проектов сотрудника
export const fetchEmployeeProjects = createAsyncThunk<
	IProjectMinimal[], // Массив проектов
	number, // employeeId
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/fetchEmployeeProjects',
	async (employeeId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get(`projects/employee/${employeeId}`);
			console.log(`fetchEmployeeProjects ${data}`);
			return data; // Возвращаем список проектов сотрудника
		} catch (error) {
			toast.error('Ошибка загрузки проектов для сотрудника');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const fetchProjects = createAsyncThunk<
	IProjectMinimal[],
	void,
	{ dispatch: AppDispatch; state: RootState }
>('projects/fetchAll', async (_, { rejectWithValue, dispatch, getState }) => {
	const client = apiClient(dispatch, getState);

	try {
		const { data } = await client.get('/projects');
		return data;
	} catch (error) {
		toast.error('Ошибка получения проектов');
		return rejectWithValue(getErrorMessage(error));
	}
});

export const createProject = createAsyncThunk<
	IProject,
	IProject,
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/create',
	async (projectData, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.post('/projects', projectData);
			toast.success('Проект успешно создан!');
			return data;
		} catch (error) {
			toast.error('Ошибка создания проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const addEmployeeToProject = createAsyncThunk<
	void, // Возвращаемый тип
	{ employeeId: number; projectId: number }, // Параметры
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/addEmployeeToProject',
	async (
		{ employeeId, projectId },
		{ rejectWithValue, dispatch, getState }
	) => {
		const client = apiClient(dispatch, getState);

		try {
			await client.patch(`projects/${projectId}/employees`, { employeeId });
			dispatch(fetchProjectById(projectId));
		} catch (error) {
			toast.error('Ошибка добавления сотрудника на проект');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const updateProjectManager = createAsyncThunk<
	void,
	{ projectId: number; managerId: number },
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/updateProjectManager',
	async ({ projectId, managerId }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			await client.patch(`projects/${projectId}/manager`, { managerId });
			dispatch(fetchProjectById(projectId)); // Обновляем проект
		} catch (error) {
			toast.error('Ошибка смены менеджера проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const addPaymentToProject = createAsyncThunk<
	IProject,
	{ projectId: number; amount: number },
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/addPayment',
	async ({ projectId, amount }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.post(`projects/${projectId}/add-payment`, {
				amount,
			});
			toast.success('Оплата по проекту внесена успешно');
			dispatch(fetchProjectById(projectId)); // Обновляем проект
			return data;
		} catch (error) {
			toast.error('Ошибка внесения оплаты');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Экшен для обновления описания проекта
export const updateProjectDescription = createAsyncThunk<
	IProject, // Возвращаемый тип
	{ projectId: number; description: string }, // Параметры
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/updateDescription',
	async (
		{ projectId, description },
		{ rejectWithValue, dispatch, getState }
	) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.patch(
				`/projects/${projectId}/description`,
				{
					description,
				}
			);
			dispatch(fetchProjectById(projectId)); // Обновляем проект
			toast.success('Описание проекта успешно обновлено!');
			return data;
		} catch (error) {
			toast.error('Ошибка обновления описания проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Экшен для обновления важной информации проекта
export const updateProjectImportantInfo = createAsyncThunk<
	IProject, // Возвращаемый тип
	{ projectId: number; importantInfo: string }, // Параметры
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/updateImportantInfo',
	async (
		{ projectId, importantInfo },
		{ rejectWithValue, dispatch, getState }
	) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.patch(
				`/projects/${projectId}/important-info`,
				{
					importantInfo,
				}
			);
			dispatch(fetchProjectById(projectId)); // Обновляем проект
			toast.success('Важная информация проекта успешно обновлена!');
			return data;
		} catch (error) {
			toast.error('Ошибка обновления важной информации проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// asyncActions.ts
export const updateProjectStatus = createAsyncThunk<
	IProject,
	{ projectId: number; status: IProjectStatus },
	{ dispatch: AppDispatch; state: RootState }
>(
	'project/updateStatus',
	async ({ projectId, status }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.patch(`/projects/${projectId}/status`, {
				status,
			});
			dispatch(fetchProjectById(projectId)); // Обновляем проект
			toast.success('Статус проекта успешно обновлен!');
			return data;
		} catch (error) {
			toast.error('Ошибка обновления статуса проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);
