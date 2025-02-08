import { IProject } from '../project/types';

// Типы для доступа
export interface IAccess {
	access_id: number;
	resourceName: string;
	login: string;
	password: string;
	project: IProject;
}

export interface AccessState {
	accesses: IAccess[];
	loading: boolean;
	error: string | null;
}
