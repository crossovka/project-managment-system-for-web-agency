import { IAccess } from '../access/types';
import { IEmployee } from '../auth/types';
import { IClient } from '../clients/types';
import { ITask } from '../tasks/types';
import { IProjectStatus } from '@/types/common';

// Типы для проектов
export interface IProject {
	project_id: number;
	name: string;
	startDate: Date;
	endDate?: Date;
	totalTurnover?: number;
	accountsReceivable?: number;
	client: IClient;
	employees: IEmployee[];
	projectManager?: IEmployee;
	tasks?: ITask[];
	access?: IAccess[];
	status: IProjectStatus;
	description: string;
	importantInfo: string;
	// createdAt: Date;
	// updatedAt: Date;
}

export interface IProjectMinimal {
	project_id: number;
	name: string;
	status: IProjectStatus;
}

export interface ProjectState {
	projects: IProjectMinimal[]; // Список проектов
	projectsLoading: boolean; // Статус загрузки списка проектов
	employeeProjects: IProjectMinimal[]; // Проекты, связанные с сотрудником
	employeeProjectsLoading: boolean; // Статус загрузки проектов сотрудника
	project: IProject | null; // Данные конкретного проекта
	projectLoading: boolean; // Статус загрузки проекта
	projectName: null,
	error: string | null; // Ошибки, если есть
	loading: boolean; //
}
