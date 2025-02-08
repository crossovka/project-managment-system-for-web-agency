import { RootState } from '../../store';
import { IEmployee } from '../auth/types';

export const selectEmployees = (state: RootState): IEmployee[] => state.employee.employees;
export const selectCurrentEmployee = (state: RootState): IEmployee | null => state.employee.currentEmployee;
export const selectIsEmployeeModalOpen = (state: RootState): boolean => state.employee.IsEmployeeModalOpen
export const selectEmployeeLoading = (state: RootState): boolean => state.employee.loading;
export const selectEmployeeError = (state: RootState): string | null => state.employee.error;
export const selectEmployeeName = (state: RootState) => state.employee.name;
export const selectHourlyRate = (state: RootState): number | null => state.employee.hourlyRate;