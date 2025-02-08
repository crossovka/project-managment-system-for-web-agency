import { Department } from '@/types/common';

export const departmentIcons: Record<Department, string> = {
	[Department.SALES_AND_MARKETING]: '/img/icons/sales.svg',
	[Department.PROJECT_MANAGEMENT]: '/img/icons/manager.svg',
	[Department.DESIGN]: '/img/icons/design.svg',
	[Department.DEVELOPMENT]: '/img/icons/developer.svg',
	[Department.SEO_AND_MARKETING]: '/img/icons/seo.svg',
};

export const departmentColors: Record<Department, string> = {
	[Department.SALES_AND_MARKETING]: '#000000', // Цвет для Sales and Marketing
	[Department.PROJECT_MANAGEMENT]: '#FF6347', // Цвет для Project Management
	[Department.DESIGN]: '#00BFFF', // Цвет для Design
	[Department.DEVELOPMENT]: '#8A2BE2', // Цвет для Development
	[Department.SEO_AND_MARKETING]: '#FFD700', // Цвет для SEO and Marketing
};
