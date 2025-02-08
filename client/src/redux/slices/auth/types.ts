import { Department, ITask, Position } from '@/types/common';
import { IProject } from '../project/types';

// типы не соотвествуют серверу
export interface IEmployee {
	employee_id: number; // Текущий залогиненный пользователь
	employeeProfile: IEmployee | null; // Профиль сотрудника, который просматривается
	name: string;
	position: Position;
	department: Department;
	statistic?: IEmployeeStatistic;
	createdTasks: ITask[];
	assignedTasks: ITask[];
	projects: IProject[];
	// createdAt: Date;
	// updatedAt: Date;
}

export interface IEmployeeStatistic {
	statistic_id: number;
	totalEarnings?: number;
	pendingEarnings?: number;
	monthlyEarnings?: number;
	hoursWorked?: number;
	// createdAt: Date;
	// updatedAt: Date;
}

export interface ILoginPayload {
	name: string;
	password: string;
}

export interface AuthState {
	employee: IEmployee | null; // Авторизованный пользователь
	token: string | null; // Токен
	loading: boolean; // Флаг загрузки
	error: string | null; // Ошибка авторизации
	success: boolean; // Флаг успешного входа
	profileLoading: boolean; // Флаг загрузки профиля
}
