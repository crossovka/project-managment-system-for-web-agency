import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchEmployees,
	createEmployee,
	fetchEmployeeName,
	payEmployee,
	fetchProjectManagers,
	fetchProjectEmployees,
	updateHourlyRate,
	fetchHourlyRate,
} from './asyncActions';
import { EmployeeState } from './types';
import { IEmployee } from '../auth/types';

const initialState: EmployeeState = {
	employees: [],
	loading: false,
	error: null,
	currentEmployee: null,
	IsEmployeeModalOpen: false,
	name: null,
	hourlyRate: null
};

const employeeSlice = createSlice({
	name: 'employee',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Общий обработчик для загрузки сотрудников
		const handlePending = (state: EmployeeState) => {
			state.loading = true;
			state.error = null;
		};

		const handleFulfilled = (
			state: EmployeeState,
			action: PayloadAction<IEmployee[]>
		) => {
			state.loading = false;
			state.employees = action.payload;
			state.error = null;
		};

		const handleRejected = (
			state: EmployeeState,
			action: PayloadAction<string | undefined>
		) => {
			state.loading = false;
			state.error = action.payload || 'Ошибка загрузки сотрудников';
		};
		// fetchEmployees
		// builder
		// 	.addCase(fetchEmployees.pending, (state) => {
		// 		state.loading = true;
		// 	})
		// 	.addCase(
		// 		fetchEmployees.fulfilled,
		// 		(state, action: PayloadAction<IEmployee[]>) => {
		// 			state.loading = false;
		// 			state.employees = action.payload;
		// 			state.error = null; // Очистить ошибку при успешной загрузке
		// 		}
		// 	)
		// 	.addCase(fetchEmployees.rejected, (state, action) => {
		// 		state.loading = false;
		// 		state.error =
		// 			(action.payload as string) || 'Ошибка загрузки сотрудников';
		// 	});

		// fetchAllEmployees
		builder.addCase(fetchEmployees.pending, handlePending);
		builder.addCase(fetchEmployees.fulfilled, handleFulfilled);
		builder.addCase(fetchEmployees.rejected, handleRejected);

		// fetchProjectManagers
		builder.addCase(fetchProjectManagers.pending, handlePending);
		builder.addCase(fetchProjectManagers.fulfilled, handleFulfilled);
		builder.addCase(fetchProjectManagers.rejected, handleRejected);

		// fetchProjectEmployees
		builder.addCase(fetchProjectEmployees.pending, handlePending);
		builder.addCase(fetchProjectEmployees.fulfilled, handleFulfilled);
		builder.addCase(fetchProjectEmployees.rejected, handleRejected);

		builder
			.addCase(fetchEmployeeName.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchEmployeeName.fulfilled,
				(state, action: PayloadAction<string>) => {
					state.name = action.payload;
					state.loading = false;
				}
			)
			.addCase(fetchEmployeeName.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка загрузки имени сотрудника';
			});

		// createEmployee
		builder
			.addCase(createEmployee.pending, (state) => {
				state.loading = true;
			})
			.addCase(createEmployee.fulfilled, (state, action) => {
				state.loading = false;
				state.employees.push(action.payload);
				state.error = null; // Очистить ошибку при успешном создании
			})
			.addCase(createEmployee.rejected, (state, action) => {
				state.loading = false;
				state.error =
					(action.payload as string) || 'Ошибка при создании сотрудника';
			});
		// payEmployee
		builder
			.addCase(payEmployee.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				payEmployee.fulfilled,
				(state, action: PayloadAction<IEmployee>) => {
					state.loading = false;
					// Обновление списка сотрудников, если сотрудник был успешно оплачен
					const updatedEmployee = action.payload;
					const index = state.employees.findIndex(
						(emp) => emp.employee_id === updatedEmployee.employee_id
					);
					if (index !== -1) {
						state.employees[index] = updatedEmployee;
					}
					state.error = null; // Очистить ошибку при успешной выплате
				}
			)
			.addCase(payEmployee.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка при выплате сотруднику';
			});

		// Обработчик для изменения почасовой ставки
		builder
			.addCase(updateHourlyRate.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				updateHourlyRate.fulfilled,
				(state, action: PayloadAction<IEmployee>) => {
					state.loading = false;
					// Обновляем текущего сотрудника, если это он
					if (
						state.currentEmployee &&
						state.currentEmployee.employee_id === action.payload.employee_id
					) {
						state.currentEmployee = action.payload;
					}
					// Обновляем список сотрудников, если он есть
					state.employees = state.employees.map((employee) =>
						employee.employee_id === action.payload.employee_id
							? action.payload
							: employee
					);
					state.error = null;
				}
			)
			.addCase(updateHourlyRate.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
			 // Обработчик для получения почасовой ставки
			 builder
			 .addCase(fetchHourlyRate.pending, (state) => {
					 state.loading = true;
					 state.error = null;
			 })
			 .addCase(fetchHourlyRate.fulfilled, (state, action: PayloadAction<number>) => {
					 state.loading = false;
					 state.hourlyRate = action.payload;
					 state.error = null;
			 })
			 .addCase(fetchHourlyRate.rejected, (state, action) => {
					 state.loading = false;
					 state.error = action.payload as string;
			 });
	},
});

export const {} = employeeSlice.actions;
export default employeeSlice.reducer;
