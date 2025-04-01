import toast from 'react-hot-toast';
import { useDrop } from 'react-dnd';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import { updateTaskStatus } from '@/redux/slices/tasks/asyncActions';

import TaskCard from '../TaskCard';
import CreateTaskButton from '@/components/elements/CreateTaskButton/CreateTaskButton';

import { isManagerOrDirector } from '@/libs/utils/isManagerOrDirector';

import { ITask } from '@/redux/slices/tasks/types';
import { ITaskStatus } from '@/types/common';
import styles from './Board.module.scss';

interface ColumnProps {
	title: string;
	tasks: ITask[];
}

const Column: React.FC<ColumnProps> = ({ title, tasks }) => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);
	const createdBy = currentUser?.employee?.employee_id;

	const dropRef = useDrop(() => ({
		accept: 'TASK',
		drop: async (item: { id: number; status: string }) => {
			if (item.status === ITaskStatus.COMPLETED) {
				toast.error('Нельзя перемещать задачи из ЗАВЕРШЕНО');
				return;
			}

			if (
				item.status === ITaskStatus.UNDER_REVIEW &&
				title !== ITaskStatus.COMPLETED
			) {
				toast.error(
					'Задачи на ПРОВЕРКЕ могут быть перемещены только в ЗАВЕРШЕНО'
				);
				return;
			}

			const updatedTask = {
				taskId: item.id,
				status: title,
			};

			try {
				if (title === ITaskStatus.UNDER_REVIEW) {
					toast(
						'Задача переведена на ПРОВЕРКУ - менеджер рассмотрит ее в ближайшее время',
						{
							icon: '🛠️',
							duration: 4000,
						}
					);
				} else if (
					title === ITaskStatus.COMPLETED &&
					!isManagerOrDirector(currentUser)
				) {
					toast('Задача перенесена на проверку - ожидает одобрения менеджера', {
						icon: '🔔',
						duration: 4000,
					});
				} else {
					toast.success(`Задача перемещена в колонку "${title}"`);
				}

				await dispatch(updateTaskStatus(updatedTask)).unwrap();
			} catch {
				toast.error('Ошибка при обновлении статуса задачи');
			}
		},
	}))[1]; // Используем только `dropRef`, без `isOver`

	return (
		<div ref={dropRef} className={styles.column}>
			<h2>
				{title}{' '}
				{title !== ITaskStatus.COMPLETED && (
					<CreateTaskButton status={title} createdBy={createdBy} />
				)}
			</h2>
			<div className={styles.column__inner}>
				{tasks.map((task) => (
					<TaskCard key={task.task_id} task={task} />
				))}
			</div>
		</div>
	);
};

export default Column;
