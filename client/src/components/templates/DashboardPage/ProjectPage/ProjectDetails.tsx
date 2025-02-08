import { useState } from 'react';

import EditDescriptionModal from '@/components/modules/modals/EditDescriptionModal';
import EditImportantInfoModal from '@/components/modules/modals/EditImportantInfoModal';

import { IClient } from '@/redux/slices/clients/types';
import styles from './ProjectPage.module.scss';

interface ProjectDetailsProps {
	client: IClient;
	startDate?: Date;
	endDate?: Date;
	totalTurnover?: number;
	accountsReceivable?: number;
	description: string;
	importantInfo: string;
	formatDate: (date?: Date) => string;
	projectId: number;
	showEditBtn: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
	client,
	startDate,
	endDate,
	totalTurnover,
	accountsReceivable,
	description,
	importantInfo,
	formatDate,
	projectId,
	showEditBtn
}) => {
	const [isEditDescriptionModalOpen, setEditDescriptionModalOpen] =
		useState<boolean>(false);
	const [isEditImportantInfoModalOpen, setEditImportantInfoModalOpen] =
		useState<boolean>(false);

	const openEditDescriptionModal = () => setEditDescriptionModalOpen(true);
	const closeEditDescriptionModal = () => setEditDescriptionModalOpen(false);

	const openEditImportantInfoModal = () => setEditImportantInfoModalOpen(true);
	const closeEditImportantInfoModal = () =>
		setEditImportantInfoModalOpen(false);

	return (
		<div className={styles.ProjectDetails}>
			<div className={styles.ProjectDetails__client}>
				<p>
					<strong>Клиент: </strong>
					{client.companyName}
				</p>
			</div>
			<div className={styles.ProjectDetails__dates}>
				<p>
					<strong>Начало: </strong>
					{formatDate(startDate)}
				</p>
				<p>
					<strong>Завершение: </strong>
					{formatDate(endDate)}
				</p>
			</div>
			<div className={styles.ProjectDetails__info}>
				<div className={styles.ProjectDetails__infoItem}>
					<strong>Описание проекта:</strong>
					<div>
						{description ?? 'Не указано'}
						{showEditBtn &&
							<button
								onClick={openEditDescriptionModal}
								className="btn btn--sm"
							>
								Редактировать
							</button>
						}
					</div>
				</div>
				<div className={styles.ProjectDetails__infoItem}>
					<strong>Важная информация:</strong>
					<div>
						{importantInfo ?? 'Не указано'}
						{showEditBtn &&
							<button
							onClick={openEditImportantInfoModal}
							className="btn btn--sm"
							>
								Редактировать
							</button>
						}
					</div>
				</div>
			</div>
			<div className={styles.ProjectDetails__money}>
				<p>
					<strong>Общий оборот: </strong>
					{totalTurnover ?? '0'}
				</p>
				<p>
					<strong>Дебиторская задолженность: </strong>
					{accountsReceivable ?? '0'}
				</p>
			</div>

			<EditDescriptionModal
				isOpen={isEditDescriptionModalOpen}
				onClose={closeEditDescriptionModal}
				projectId={projectId}
				currentDescription={description}
			/>
			<EditImportantInfoModal
				isOpen={isEditImportantInfoModalOpen}
				onClose={closeEditImportantInfoModal}
				projectId={projectId}
				currentImportantInfo={importantInfo}
			/>
		</div>
	);
};

export default ProjectDetails;
