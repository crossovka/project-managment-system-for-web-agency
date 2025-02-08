import { Department, Position } from './types'

export const departmentPositionMap: Record<Department, Position[]> = {
	[Department.SALES_AND_MARKETING]: [Position.ACCOUNT_MANAGER, Position.SALES_MANAGER],
	[Department.PROJECT_MANAGEMENT]: [Position.PROJECT_MANAGER, Position.DIRECTOR],
	[Department.DESIGN]: [
		Position.FIGMA_DESIGNER,
		Position.GRAPHIC_DESIGNER,
		Position.THREE_D_DESIGNER
	],
	[Department.DEVELOPMENT]: [
		Position.FULLSTACK_DEVELOPER,
		Position.BACKEND_DEVELOPER,
		Position.FRONTEND_DEVELOPER
	],
	[Department.SEO_AND_MARKETING]: [
		Position.CONTENT_MANAGER,
		Position.SEO_SPECIALIST,
		Position.ADVERTISING_SPECIALIST
	]
}
