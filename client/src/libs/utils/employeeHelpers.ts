import { IEmployee } from '@/redux/slices/auth/types';
import { Department, Position } from '@/types/common';

export const groupEmployeesByDepartment = (
	employees: IEmployee[]
): Record<string, IEmployee[]> => {
	return employees.reduce((acc, employee) => {
		const department = employee.department || 'Other';
		return {
			...acc,
			[department]: [...(acc[department] || []), employee],
		};
	}, {} as Record<string, IEmployee[]>);
};

export const departmentPositionMap: Record<Department, Position[]> = {
	[Department.SALES_AND_MARKETING]: [
		Position.ACCOUNT_MANAGER,
		Position.SALES_MANAGER,
	],
	[Department.PROJECT_MANAGEMENT]: [Position.PROJECT_MANAGER],
	[Department.DESIGN]: [
		Position.FIGMA_DESIGNER,
		Position.GRAPHIC_DESIGNER,
		Position.THREE_D_DESIGNER,
	],
	[Department.DEVELOPMENT]: [
		Position.FULLSTACK_DEVELOPER,
		Position.BACKEND_DEVELOPER,
		Position.FRONTEND_DEVELOPER,
	],
	[Department.SEO_AND_MARKETING]: [
		Position.CONTENT_MANAGER,
		Position.SEO_SPECIALIST,
		Position.ADVERTISING_SPECIALIST,
	],
};
