import Link from 'next/link';
import { useState } from 'react';

import { useAppDispatch } from '@/redux/store';
import { resetTask } from '@/redux/slices/tasks/slice';

import EmployeeItem from '@/components/elements/EmployeeItem';

import { TaskStatusColors } from '@/constants/TaskStatusColors';
import { ITask } from '@/redux/slices/tasks/types';

import ViewTaskModal from '@/components/modules/modals/ViewTaskModal';
import ViewIcon from '@/components/elements/Icons/ViewIcon';

import styles from './ProjectPage.module.scss';

interface ProjectTasksProps {
	id: number;
	tasks: ITask[];
	formatDate: (date?: Date) => string;
}

const ProjectTasks = ({ id, tasks, formatDate }: ProjectTasksProps) => {
	const dispatch = useAppDispatch();
	// Сортировка задач по дате (ближайшая дата первой)
	const sortedTasks = [...tasks].sort((a, b) => {
		const dateA = new Date(a.dueDate).getTime();
		const dateB = new Date(b.dueDate).getTime();
		return dateA - dateB; // Сравнение дат
	});

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleOpenModal = (task_id: number ) => {
		setSelectedTaskId(task_id);
		setIsModalOpen(true);
};

	const handleCloseModal = () => {
			setIsModalOpen(false);
			setSelectedTaskId(null);
			dispatch(resetTask());
	};

	return (
		<div className={styles.tasks}>
			<Link
				href={`/dashboard/tasks/projects/${id}/`}
				className={`${styles.tasksLink} link`}
			>
				Невыполненные задачи ({tasks.length})
			</Link>
			<ul>
				{sortedTasks.map((task) => (
					<li key={task.task_id} className={styles.task}>
						<div className={styles.task__inner}>
							<p className={styles.task__date}>
								До: {formatDate(task.dueDate)}
							</p>
							<p
								className={styles.task__status}
								style={
									{
										'--task-status-color': TaskStatusColors[task.status],
									} as React.CSSProperties
								}
							>
								{task.status}
							</p>
							<button
								className={styles.viewButton}
								onClick={() => handleOpenModal(task.task_id)}
							>
								<ViewIcon />
						</button>
							{task.assignedTo ? (
								<EmployeeItem employee={task.assignedTo} />
							) : (
								<p>Не назначено</p>
							)}
						</div>
						<p className={styles.task__title}>{task.title}</p>
					</li>
				))}
			</ul>
			<ViewTaskModal
                taskId={selectedTaskId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
		</div>
	);
};

export default ProjectTasks;
