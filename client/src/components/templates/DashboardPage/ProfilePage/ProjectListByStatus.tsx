import React from 'react';
import Link from 'next/link';
import { IProjectStatus } from '@/types/common';
import { IProject } from '@/redux/slices/project/types';

interface ProjectListByStatusProps {
	projects: IProject[];
}

const ProjectListByStatus: React.FC<ProjectListByStatusProps> = ({
	projects,
}) => {
	// Массив всех возможных статусов
	const projectStatuses: IProjectStatus[] = [
		IProjectStatus.IN_PROGRESS,
		IProjectStatus.COMPLETED,
		IProjectStatus.ON_HOLD,
		IProjectStatus.CANCELED,
	];

	// Функция фильтрации проектов по статусу
	const filterProjectsByStatus = (status: IProjectStatus) => {
		return projects.filter((project) => project.status === status);
	};

	return (
		<div>
			{/* Динамически генерируем секции для каждого статуса */}
			{projectStatuses.map((status) => {
				const filteredProjects = filterProjectsByStatus(status);

				// Если есть проекты для текущего статуса, то выводим
				if (filteredProjects.length > 0) {
					return (
						<div key={status}>
							<h4>{status}</h4>
							<ul>
								{filteredProjects.map((project) => (
									<li key={project.project_id}>
										<Link href={`/dashboard/projects/${project.project_id}`}>
											<h4>{project.name}</h4>
										</Link>
									</li>
								))}
							</ul>
						</div>
					);
				}
				return null;
			})}
		</div>
	);
};

export default ProjectListByStatus;
