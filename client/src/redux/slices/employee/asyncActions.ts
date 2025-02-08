import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '@/redux/store';
import { apiClient } from '@/libs/utils/apiClient';
import { IEmployee } from '../auth/types';
import { fetchEmployeeProfile, fetchProfile } from '../auth/asyncActions';

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
			// Если произошла ошибка, возвращаем сообщение об ошибке
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка загрузки сотрудников';
			return rejectWithValue(errorMessage);
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
			return rejectWithValue('Ошибка при создании сотрудника');
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка загрузки имени сотрудника';
			return rejectWithValue(errorMessage);
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
			// Извлечение сообщения об ошибке
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Произошла ошибка при выплате сотруднику';
			return rejectWithValue(errorMessage); // Возврат ошибки через rejectWithValue
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка загрузки проектных менеджеров';
			return rejectWithValue(errorMessage);
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка загрузки сотрудников проекта';
			return rejectWithValue(errorMessage);
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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Ошибка при изменении почасовой ставки';
			return rejectWithValue(errorMessage);
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
            const errorMessage = (error as AxiosError)?.response?.data?.message || 'Ошибка при получении почасовой ставки';
            return rejectWithValue(errorMessage);
        }
    }
);