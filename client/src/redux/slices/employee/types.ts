import { IEmployee } from '../auth/types';

export interface EmployeeState {
	employees: IEmployee[];
	loading: boolean;
	error: string | null;
	currentEmployee: IEmployee | null;
	name: string | null;
	IsEmployeeModalOpen: boolean;
	hourlyRate: number | null;
}
