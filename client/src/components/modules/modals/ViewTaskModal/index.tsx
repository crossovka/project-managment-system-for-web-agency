import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectCurrentTask,
	selectTasksError,
	selectTasksLoading,
} from '@/redux/slices/tasks/selectors';
import { fetchTaskById } from '@/redux/slices/tasks/asyncActions';

import { BaseModal } from '@/components/elements/Modal';

import styles from './ViewTaskModal.module.scss';

interface ViewTaskModalProps {
	taskId: number;
	isOpen: boolean;
	onClose: () => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
	taskId,
	isOpen,
	onClose,
}) => {
	const dispatch = useAppDispatch();
	const task = useAppSelector(selectCurrentTask);
	const loading = useAppSelector(selectTasksLoading);
	const error = useAppSelector(selectTasksError);

	useEffect(() => {
		if (isOpen && !task) {
			dispatch(fetchTaskById(taskId));
		}
	}, [isOpen, task, dispatch, taskId]);

	console.log('Task in ViewTaskModal:', task);

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title={task?.title || 'Информация о задаче'}
			size="md"
		>
			{loading ? (
				<div className={styles.loading}>Загрузка...</div>
			) : error ? (
				<div className={styles.error}>{error}</div>
			) : task ? (
				<div className={styles.modalContent}>
					<button className={styles.closeButton} onClick={onClose}>
						&times;
					</button>
					<h3 className={styles.modalTitle}>Название: {task.title}</h3>
					<div className={`${styles.field} content-field`}>
						<span className={styles.fieldLabel}>Описание:</span>
						<div
							className={styles.fieldValue}
							dangerouslySetInnerHTML={{
								__html: task.description || 'Нет описания',
							}}
						/>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Статус:</span>
						<span className={styles.fieldValue}>
							{task.status || 'Неизвестно'}
						</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Тип работы:</span>
						<span className={styles.fieldValue}>
							{task.workType || 'Неизвестно'}
						</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Часы:</span>
						<span className={styles.fieldValue}>{task.hours || 0}</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Минуты:</span>
						<span className={styles.fieldValue}>{task.minutes || 0}</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Стоимость:</span>
						<span className={styles.fieldValue}>{task.cost || '0'}</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Дата начала:</span>
						<span className={styles.fieldValue}>
							{task.startDate
								? new Date(task.startDate).toLocaleDateString()
								: 'Не указана'}
						</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Дата окончания:</span>
						<span className={styles.fieldValue}>
							{task.dueDate
								? new Date(task.dueDate).toLocaleDateString()
								: 'Не указана'}
						</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Проект:</span>
						<span className={styles.fieldValue}>
							{task.project?.name || 'Не указан'}
						</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Создатель:</span>
						<span className={styles.fieldValue}>
							{task.createdBy?.name || 'Неизвестно'}
						</span>
					</div>
					<div className={styles.field}>
						<span className={styles.fieldLabel}>Исполнитель:</span>
						<span className={styles.fieldValue}>
							{task.assignedTo?.name || 'Не назначен'}
						</span>
					</div>
				</div>
			) : null}
		</BaseModal>
	);
};

export default ViewTaskModal;
