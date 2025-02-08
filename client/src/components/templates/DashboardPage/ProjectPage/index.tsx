'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearProject } from '@/redux/slices/project/slice';
import {
	selectProject,
	selectProjectError,
	selectProjectLoading,
} from '@/redux/slices/project/selectors';
import { fetchProjectById } from '@/redux/slices/project/asyncActions';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import AccessDetailsModal from '@/components/modules/modals/AccessDetailsModal';
import AddEmployeeModal from '@/components/modules/modals/AddEmployeeModal';
import UpdateProjectManagerModal from '@/components/modules/modals/UpdateProjectManagerModal';

import ProjectHeader from './ProjectHeader';
import ProjectTasks from './ProjectTasks';
import ProjectDetails from './ProjectDetails';
import ProjectAccess from './ProjectAccess';
import ProjectEmployees from './ProjectEmployees';

import {
	isDirector,
	isManagerOrDirector,
} from '@/libs/utils/isManagerOrDirector';
import { IAccess } from '@/redux/slices/access/types';
import styles from './ProjectPage.module.scss';
import { PaymentProjectModal } from '@/components/modules/modals/PaymentProjectModal';

const ProjectPage = ({ id }: { id: string }) => {
	const dispatch = useAppDispatch();
	const project = useAppSelector(selectProject);
	const loading = useAppSelector(selectProjectLoading);
	const error = useAppSelector(selectProjectError);
	const currentUser = useAppSelector(selectCurrentUser);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
	const [isChangeProjectManagerModal, setIsChangeProjectManagerModal] =
		useState(false);
	const [isPayModalOpen, setPayModalOpen] = useState(false);
	const [selectedAccess, setSelectedAccess] = useState<IAccess | null>(null);

	const handleEditAccess = (access: IAccess) => {
		setSelectedAccess(access);
		setIsModalOpen(true);
	};

	const openModal = () => {
		setSelectedAccess(null);
		setIsModalOpen(true);
	};
	const closeModal = () => setIsModalOpen(false);

	const openAddEmployeeModal = () => setIsAddEmployeeModalOpen(true);
	const closeAddEmployeeModal = () => setIsAddEmployeeModalOpen(false);

	const openProjectManagerModal = () => setIsChangeProjectManagerModal(true);
	const closeProjectManagerModal = () => setIsChangeProjectManagerModal(false);

	useEffect(() => {
		if (id) dispatch(fetchProjectById(+id));
		return () => dispatch(clearProject());
	}, [id, dispatch]);

	if (loading) return <LoadingSpinner />;
	if (error) return <p>Ошибка: {error}</p>;
	if (!project) return <p>Проект не найден</p>;

	const {
		project_id,
		name,
		client,
		projectManager,
		employees,
		tasks,
		access,
		description,
		importantInfo,
	} = project;
console.log(project)
	const formatDate = (date?: Date): string =>
		date ? new Date(date).toLocaleDateString() : 'Не указано';

	return (
		<div className={styles.project}>
			<ProjectHeader name={name} status={project.status} projectId={project_id} showStatusBtn={isManagerOrDirector(currentUser)}/>
			<div className={styles.project__inner}>
				<div className={styles.project__inner_left}>
					<ProjectTasks id={+id} tasks={tasks} formatDate={formatDate} />
				</div>
				<div className={styles.project__inner_right}>
					<ProjectDetails
						client={client}
						startDate={project.startDate}
						endDate={project.endDate}
						totalTurnover={project.totalTurnover}
						accountsReceivable={project.accountsReceivable}
						description={description}
						importantInfo={importantInfo}
						formatDate={formatDate}
						projectId={project.project_id}
						showEditBtn={isManagerOrDirector(currentUser)}
					/>
					{isDirector(currentUser) && (
						<button
							onClick={() => setPayModalOpen(true)}
							className={'btn btn--sm'}
						>
							Внести деньги
						</button>
					)}
					{projectManager && <ProjectEmployees employees={[projectManager]} />}
					{/* Кнопка для смены проектного менеджера */}
					{isDirector(currentUser) && projectManager && (
						<button onClick={openProjectManagerModal} className={'btn btn--sm'}>
							Сменить менеджера проекта
						</button>
					)}
				</div>
			</div>
			<div className={styles.footer}>
				<ProjectEmployees
					employees={employees}
					showAddEmployeeButton={isManagerOrDirector(currentUser)}
					openAddEmployeeModal={openAddEmployeeModal}
					title={'Сотрудники проекта'}
				/>
				<ProjectAccess
					access={access}
					handleEditAccess={handleEditAccess}
					openModal={openModal}
				/>
			</div>
			<AccessDetailsModal
				isOpen={isModalOpen}
				onClose={closeModal}
				projectId={+project.project_id}
				selectedAccess={selectedAccess}
			/>
			<AddEmployeeModal
				isOpen={isAddEmployeeModalOpen}
				onClose={closeAddEmployeeModal}
				projectId={+project.project_id}
			/>
			<UpdateProjectManagerModal
				isOpen={isChangeProjectManagerModal}
				onClose={closeProjectManagerModal}
				projectId={+project.project_id}
			/>
			<PaymentProjectModal
				isOpen={isPayModalOpen}
				onClose={() => setPayModalOpen(false)}
				projectId={project.project_id}
				totalTurnover={project.totalTurnover}
				accountsReceivable={project.accountsReceivable}
			/>
		</div>
	);
};

export default ProjectPage;
