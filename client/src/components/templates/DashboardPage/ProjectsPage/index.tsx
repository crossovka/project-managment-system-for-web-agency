'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectProjectError,
	selectProjects,
	selectProjectsLoading,
} from '@/redux/slices/project/selectors';
import { fetchProjects } from '@/redux/slices/project/asyncActions';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import CreateProjectModal from '@/components/modules/modals/ProjectModal';
import Tabs from '@/components/elements/Tabs';
import SearchInput from '@/components/elements/SearchInput';

import { isDirector } from '@/libs/utils/isManagerOrDirector';

import styles from './ProjectsPage.module.scss';

const ProjectsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const projects = useAppSelector(selectProjects);
	const loading = useAppSelector(selectProjectsLoading);
	const error = useAppSelector(selectProjectError);

	const currentUser = useAppSelector(selectCurrentUser);

	const [isModalOpen, setModalOpen] = useState(false);
	const [activeStatus, setActiveStatus] = useState<string>('Все проекты'); // Активный статус
	const [searchTerm, setSearchTerm] = useState<string>(''); // Поисковый запрос

	useEffect(() => {
		dispatch(fetchProjects());
	}, [dispatch]);

	// Фильтрация проектов по статусу и поисковому запросу
	const filteredProjects = projects.filter((project) => {
		const matchesStatus =
			activeStatus === 'Все проекты' || project.status === activeStatus;
		const matchesSearch = project.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	// Уникальные статусы
	const projectStatuses = [
		'Все проекты',
		...new Set(projects.map((project) => project.status)),
	];

	if (loading) return <LoadingSpinner />;
	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<div className={styles.header}>
				<h1>Проекты компании</h1>
				{isDirector(currentUser) && (
					<button onClick={() => setModalOpen(true)} className="add-new-btn">
						<span>+</span>
					</button>
				)}
			</div>

			{/* Поле поиска */}
			<SearchInput
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder="Поиск проектов..."
			/>

			{/* Использование компонента Tabs */}
			<Tabs
				tabs={projectStatuses}
				activeTab={activeStatus}
				onTabChange={setActiveStatus}
			/>

			{/* Список проектов */}
			<ul className={styles.projectsList}>
				{filteredProjects.map((project) => (
					<li key={project.project_id} className={styles.projectCard}>
						<Link href={`/dashboard/projects/${project.project_id}`}>
							<h2>{project.name}</h2>
							<p>{project.status}</p>
						</Link>
					</li>
				))}
			</ul>

			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
};

export default ProjectsPage;
