import React, { useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectEmployeeProjects,
	selectEmployeeProjectsLoading,
	selectProjectError,
} from '@/redux/slices/project/selectors';
import { fetchEmployeeProjects } from '@/redux/slices/project/asyncActions';
import { selectEmployee } from '@/redux/slices/auth/selectors';

import styles from './ProjectDropdown.module.scss';

interface ProjectDropdownProps {
	selectedProjectId?: number;
	onChange: (projectId: number | null) => void;
	userId: number;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
	selectedProjectId,
	onChange,
	userId,
}) => {
	const dispatch = useAppDispatch();
	const employeeProjects = useAppSelector(selectEmployeeProjects);
	const loading = useAppSelector(selectEmployeeProjectsLoading);
	const error = useAppSelector(selectProjectError);

	const [searchQuery, setSearchQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		console.log(`userId изменился: ${userId}`);
		if (userId) {
			dispatch(fetchEmployeeProjects(userId));
		}
	}, [dispatch, userId]);

	const filteredProjects = employeeProjects.filter((project) =>
		project.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSelectProject = (projectId: number) => {
		onChange(projectId);
		setIsDropdownOpen(false);
	};

	const handleClearSelection = (e: React.MouseEvent) => {
		e.stopPropagation(); // Чтобы клик по кнопке не закрывал дропдаун
		onChange(null);
	};

	const selectedProject = employeeProjects.find(
		(project) => project.project_id === selectedProjectId
	);

	return (
		<div className={styles.dropdown}>
			<div
				className={styles.selectedProject}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{selectedProject ? (
					<div className={styles.selectedProjectDetails}>
						<h2>{selectedProject.name}</h2>
						<p>{selectedProject.status}</p>
						<button
							className={styles.clearSelection}
							onClick={handleClearSelection}
						>
							×
						</button>
					</div>
				) : (
					<span>Выберите проект</span>
				)}
			</div>

			{/* Дропдаун с поиском */}
			{isDropdownOpen && (
				<div className={styles.dropdownList}>
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Поиск..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					{/* Отображение загрузки */}
					{loading && <div className={styles.loading}>Загрузка...</div>}

					{/* Отображение ошибки */}
					{error && !loading && (
						<div className={styles.error}>Ошибка загрузки проектов</div>
					)}

					{/* Если загрузка завершена и нет проектов */}
					{!loading && filteredProjects.length === 0 && (
						<div className={styles.noResults}>Нет проектов</div>
					)}

					{/* Отображение проектов */}
					{!loading &&
						filteredProjects.length > 0 &&
						filteredProjects.map((project) => (
							<div
								key={project.project_id}
								className={styles.projectItem}
								onClick={() => handleSelectProject(project.project_id)}
							>
								<h2>{project.name}</h2>
								{/* <p>{project.status}</p> */}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default ProjectDropdown;
