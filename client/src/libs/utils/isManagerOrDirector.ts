import { IEmployee } from '@/redux/slices/auth/types';
import { Position } from '@/types/common';

export const isManagerOrDirector = (user: IEmployee | null): boolean => {
	if (!user?.employee?.position) {
		return false;
	}

	return [Position.PROJECT_MANAGER, Position.DIRECTOR].includes(
		user.employee.position as Position
	);
};

export const isDirector = (user: IEmployee | null): boolean => {
	if (!user?.employee?.position) {
		return false;
	}

	return [Position.DIRECTOR].includes(
		user.employee.position as Position
	);
};

// метод для проверки, является ли пользователь менеджером конкретного проекта
export const isProjectManagerOf = (user: IEmployee, project: { projectManager: IEmployee }): boolean => {
    return project.projectManager && user.employee_id === project.projectManager.employee_id;
};