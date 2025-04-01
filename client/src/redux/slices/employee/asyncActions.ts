import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
import { getErrorMessage } from '@/libs/utils/getErrorMessage';
import { IEmployee } from '../auth/types';
import { fetchEmployeeProfile } from '../auth/asyncActions';

// В fetchEmployees вы уже передаете dispatch и getState
export const fetchEmployees = createAsyncThunk<
	IEmployee[], // Тип данных, которые мы получим в результате
	void, // Нет параметров, если не нужно передавать аргументы
	{ dispatch: AppDispatch; state: RootState } // Типы для dispatch и state
>(
	'employee/fetchEmployees', // Название экшена
	async (_, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState); // Инициализация клиента для запроса

		// Имитация задержки в 5 секунд
		await new Promise((resolve) => setTimeout(resolve, 1000));

		try {
			const { data } = await client.get('employees'); // Запрос для получения списка сотрудников
			console.log(data);
			return data.employees; // Возвращаем данные, чтобы сохранить их в state
		} catch (error) {
			toast.error('Ошибка загрузки сотрудников');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const createEmployee = createAsyncThunk<
	IEmployee,
	Partial<IEmployee>,
	{ dispatch: AppDispatch; state: RootState }
>(
	'employee/createEmployee',
	async (newEmployee, { rejectWithValue, dispatch, getState }) => {
		try {
			const client = apiClient(dispatch, getState);
			const { data } = await client.post('employees', newEmployee);
			return data.employee;
		} catch (error) {
			toast.error('Ошибка при создании сотрудника');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const fetchEmployeeName = createAsyncThunk<
	string, // Тип данных, которые возвращает экшен (имя сотрудника)
	number, // Тип параметра (ID сотрудника)
	{ dispatch: AppDispatch; state: RootState } // Типы dispatch и state
>(
	'employee/fetchEmployeeName', // Название экшена
	async (employeeId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState); // Инициализация клиента для запроса

		try {
			const { data } = await client.get<{ name: string }>(
				`employees/${employeeId}/name`
			);
			return data.name; // Возвращаем имя сотрудника
		} catch (error) {
			toast.error('Ошибка загрузки имени сотрудника');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const payEmployee = createAsyncThunk<
	IEmployee, // Тип данных, возвращаемых в результате
	{ employeeId: number; amount: number }, // Входные параметры: ID сотрудника и сумма
	{ rejectValue: string; dispatch: AppDispatch; state: RootState } // Типы для rejectValue, dispatch и state
>(
	'employee/payEmployee', // Название экшена
	async ({ employeeId, amount }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState); // Инициализация API-клиента

		try {
			// Запрос к API для выплаты сотруднику
			const { data } = await client.post<IEmployee>(
				`employee-statistic/${employeeId}`,
				{
					paymentAmount: amount,
				}
			);

			// Возвращаем обновленные данные сотрудника
			// После успешной выплаты обновляем данные сотрудника
			dispatch(fetchEmployeeProfile(employeeId));
			return data;
		} catch (error) {
			toast.error('Произошла ошибка при выплате сотруднику');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Получение только проектных менеджеров
export const fetchProjectManagers = createAsyncThunk<
	IEmployee[],
	void,
	{ dispatch: AppDispatch; state: RootState }
>(
	'employee/fetchProjectManagers',
	async (_, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.get('employees/managers');
			return data.employees;
		} catch (error) {
			toast.error('Ошибка загрузки проектных менеджеров');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Получение сотрудников конкретного проекта
export const fetchProjectEmployees = createAsyncThunk<
	IEmployee[],
	{ projectId: number },
	{ dispatch: AppDispatch; state: RootState }
>(
	'employee/fetchProjectEmployees',
	async ({ projectId }, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.get(`employees/projects/${projectId}`);
			console.log(data);
			return data.employees;
		} catch (error) {
			toast.error('Ошибка загрузки сотрудников проекта');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Экшен для изменения почасовой ставки
export const updateHourlyRate = createAsyncThunk<
	IEmployee, // Тип данных, которые мы получим в результате
	{ employeeId: number; hourlyRate: number }, // Тип параметров
	{ dispatch: AppDispatch; state: RootState } // Типы для dispatch и state
>(
	'employee/updateHourlyRate',
	async (
		{ employeeId, hourlyRate },
		{ rejectWithValue, dispatch, getState }
	) => {
		const client = apiClient(dispatch, getState); // Инициализация клиента для запроса

		try {
			const { data } = await client.put(`employees/${employeeId}/rate`, {
				hourlyRate,
			});
			dispatch(fetchEmployeeProfile(employeeId));
			return data;
		} catch (error) {
			toast.error('Ошибка при изменении почасовой ставки');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

// Экшен для получения почасовой ставки
export const fetchHourlyRate = createAsyncThunk<
	number, // Тип данных, которые мы получим в результате
	number, // Тип параметров
	{ dispatch: AppDispatch; state: RootState } // Типы для dispatch и state
>(
	'employee/fetchHourlyRate',
	async (employeeId, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState); // Инициализация клиента для запроса

		try {
			const { data } = await client.get(`employees/${employeeId}/hourly-rate`);
			return data.hourlyRate;
		} catch (error) {
			toast.error('Ошибка при получении почасовой ставки');
			return rejectWithValue(getErrorMessage(error));
		}
	}
);
