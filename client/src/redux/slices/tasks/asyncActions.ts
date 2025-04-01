import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
import { getErrorMessage } from '@/libs/utils/getErrorMessage';
import { ITask, UpdateTaskPayload } from './types';

export const fetchTasksByEmployeeId = createAsyncThunk<
	ITask[],
	number, // employee_id as a parameter
	{ dispatch: AppDispatch; state: RootState }
>(
	'tasks/fetchByEmployee',
	async (employeeId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get(`tasks/employee/${employeeId}`);
			return data;
		} catch (error) {
			toast.error('Ошибка загрузки задач');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const fetchTasksByProjectId = createAsyncThunk<
	ITask[],
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'tasks/fetchByProject',
	async (projectId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get(`tasks/project/${projectId}`);
			return data;
		} catch (error) {
			toast.error('Ошибка загрузки задач проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Экшн для обновления статуса задачи
export const updateTaskStatus = createAsyncThunk<
	ITask,
	{ taskId: number; status: string },
	{ dispatch: AppDispatch; state: RootState }
>(
	'tasks/updateStatus',
	async ({ taskId, status }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.patch(`tasks/${taskId}`, { status });
			return data;
		} catch (error) {
			toast.error('Ошибка обновления статуса задачи');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Экшн для обновления задачи
export const updateTask = createAsyncThunk<
	ITask,
	UpdateTaskPayload,
	{ dispatch: AppDispatch; state: RootState }
>(
	'tasks/update',
	async ({ taskId, updates }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.patch(`tasks/${taskId}`, updates);
			return data;
		} catch (error) {
			toast.error('Ошибка обновления задачи');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// export const updateTask = createAsyncThunk<
//     ITask,
//     UpdateTaskPayload,
//     { dispatch: AppDispatch; state: RootState }
// >(
//     'tasks/update',
//     async ({ taskId, updates }, { rejectWithValue, dispatch, getState }) => {
//         const client = axios.create({
//             baseURL: 'http://localhost:3000/api',
//             // Здесь можно добавить другие настройки, например, заголовки
//         });

//         try {
//             console.log(`[Client] Updating task with ID ${taskId} with updates:`, updates);
//             const response = await client.patch(`/tasks/${taskId}`, updates);
//             console.log('[Client] Task updated successfully:', response.data);
//             return response.data;
//         } catch (error: any) {
//             console.error('[Client] Error updating task:', error.response ? error.response.data : error.message);
//             return rejectWithValue(
//                 error.response?.data?.message || 'Ошибка обновления задачи'
//             );
//         }
//     }
// );

// Экшн для создания задачи
export const createTask = createAsyncThunk<
	ITask,
	Partial<ITask>,
	{ dispatch: AppDispatch; state: RootState }
>('tasks/create', async (taskData, { rejectWithValue, dispatch, getState }) => {
	const client = apiClient(dispatch, getState);
	try {
		console.log('Sending task data:', taskData);
		const { data } = await client.post('tasks', taskData);
		console.log('Task created:', data);
		return data;
	} catch (error) {
		toast.error('Ошибка создания задачи');
		return rejectWithValue(getErrorMessage(error));
	}
});

export const fetchTaskById = createAsyncThunk<
	ITask,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'tasks/fetchById',
	async (taskId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get(`tasks/${taskId}`);
			console.log(data);
			return data;
		} catch (error) {
			toast.error('Ошибка при загрузке задачи');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);
