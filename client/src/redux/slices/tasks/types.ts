import { IEmployee } from '../auth/types';
import { IProject } from '../project/types';
import { ITaskStatus, WorkType } from '@/types/common';

export interface ITask {
	task_id: number;
	title: string;
	description?: string;
	startDate: Date;
	dueDate?: Date;
	project_id: IProject;
	createdBy: IEmployee;
	assignedTo: IEmployee;
	status: ITaskStatus;
	workType: WorkType;
	hours?: number;
	minutes?: number;
	cost?: string | number;
	// createdAt: Date;
	// updatedAt: Date;
}

export interface TasksState {
	tasks: ITask[] | null;
	loading: boolean;
	error: string | null;
	IsTaskModalOpen: boolean;
	currentTask: ITask | null;
}

export interface UpdateTaskPayload {
	taskId: number;
	updates: Partial<ITask>;
}
