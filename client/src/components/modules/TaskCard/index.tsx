import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useDrag } from 'react-dnd';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import { openTaskModal, resetTask } from '@/redux/slices/tasks/slice';

import { isProjectManagerOf } from '@/libs/utils/isManagerOrDirector';
import {
	formatToISOString,
	formatToLocalDate,
} from '@/libs/utils/dateFormatters';

import ViewTaskModal from '../modals/ViewTaskModal';
import ViewIcon from '../../elements/Icons/ViewIcon';
import HammerIcon from '../../elements/Icons/HammerIcon';

import { ITask } from '@/redux/slices/tasks/types';
import { ITaskStatus, Position } from '@/types/common';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
	task: ITask;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);
	console.log(currentUser);
	const ref = useRef<HTMLDivElement>(null);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

	const handleOpenModal = (task_id: number) => {
		setSelectedTaskId(task_id);
		setIsModalOpen(true);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTaskId(null);
		dispatch(resetTask());
	};

	const isCreator =
		currentUser.employee.employee_id === task.createdBy.employee_id;
	const isAssigned =
		currentUser.employee.employee_id === task.assignedTo.employee_id;
	const isDirector = currentUser.employee.position === Position.DIRECTOR;
	const isProjectManager = isProjectManagerOf(currentUser, task.project);

	// Объяснение:
	// 1.
	// Если задача находится на рассмотрении (ITaskStatus.UNDER_REVIEW):
	// Директор (isDirector): Может редактировать задачу.
	// Менеджер проекта (isProjectManager): Может редактировать задачу, только если задача не завершена (task.status !== ITaskStatus.COMPLETED).
	// 2.
	// Если задача не находится на рассмотрении:
	// Редактировать её могут:
	// Создатель задачи (isCreator).
	// Назначенный сотрудник (isAssigned).
	// Директор (isDirector).
	// Менеджер проекта (isProjectManager).
	// Условие для отображения кнопки "Редактировать задачу"
	const canEdit =
  task.status !== ITaskStatus.COMPLETED && // Prevent editing if task is COMPLETED
  (
    task.status === ITaskStatus.UNDER_REVIEW
      ? isDirector || isProjectManager // Can edit if status is UNDER_REVIEW for Director/Project Manager
      : isCreator || isAssigned || isDirector || isProjectManager // Otherwise, allow for Creator/Assigned/Director/Project Manager
  );

	const handleEditClick = (task: ITask) => (e: React.MouseEvent) => {
		e.preventDefault();
		if (canEdit) {
			dispatch(openTaskModal(task));
		}
	};

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'TASK',
		item: { id: task.task_id, status: task.status },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	drag(ref);

	return (
		<div
			ref={ref}
			className={styles.card}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<div className={styles.dates}>
				<time dateTime={formatToISOString(task.startDate)}>
					{formatToLocalDate(task.startDate)}
				</time>
				<span>До</span>
				<time dateTime={formatToISOString(task.dueDate)}>
					{formatToLocalDate(task.dueDate)}
				</time>
			</div>

			<div className={styles.main}>
				<h3>{task.title}</h3>
				<span>-</span>
				<Link href={`/dashboard/projects/${task.project.project_id}`}>
					{task.project.name}
				</Link>
			</div>

			<button
				className={styles.viewButton}
				onClick={() => handleOpenModal(task.task_id)}
			>
				<ViewIcon />
			</button>
			<div className={styles.footer}>
				<span>
					<HammerIcon />
					{task.createdBy.name}
				</span>
				<span>{task.assignedTo.name}</span>
			</div>
			{canEdit && (
				<a
					className={`${styles.edit} btn btn--sm`}
					href="#"
					onClick={handleEditClick(task)}
				>
					Редактировать задачу
				</a>
			)}
			<ViewTaskModal
				taskId={selectedTaskId}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default TaskCard;
