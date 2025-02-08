import { useState } from 'react';
import EditProjectStatusModal from '@/components/modules/modals/EditProjectStatusModal';
import styles from './ProjectPage.module.scss';

interface ProjectHeaderProps {
	name: string;
	status: string;
	projectId: number;
	showStatusBtn: boolean;
}

const ProjectHeader = ({ name, status, projectId, showStatusBtn }: ProjectHeaderProps) => {
	const [isEditStatusModalOpen, setEditStatusModalOpen] = useState<boolean>(false);

	const openEditStatusModal = () => setEditStatusModalOpen(true);
	const closeEditStatusModal = () => setEditStatusModalOpen(false);

	return (
		<>
	<div className={styles.heading}>
		<h1>{name}</h1>
		{/* <p>Статус проекта: {status}</p> */}
		<span>{status}</span>
		
		{showStatusBtn && 
			<button onClick={openEditStatusModal} className="btn btn--sm">
					Изменить статус
			</button>
		}
	</div>
	<EditProjectStatusModal
		isOpen={isEditStatusModalOpen}
		onClose={closeEditStatusModal}
		projectId={projectId}
		currentStatus={status}
	/>
		</>
);
}
export default ProjectHeader;
