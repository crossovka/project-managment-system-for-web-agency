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
	// console.log("Created By:", createdBy);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'TASK',
		drop: async (item: { id: number; status: string }) => {
			// 1. Запрет перемещения задач из COMPLETED
			if (item.status === ITaskStatus.COMPLETED) {
				toast.error('Cannot move tasks from COMPLETED');
				return;
			}

			// 2. Ограничение перемещения задач из UNDER_REVIEW только в COMPLETED
			if (
				item.status === ITaskStatus.UNDER_REVIEW &&
				title !== ITaskStatus.COMPLETED
			) {
				toast.error('Задачи на ПРОВЕРКЕ могут быть перемещены только в ЗАВЕРШЕНО');
				return;
			}

			// 3. Подготовка данных для обновления задачи
			const updatedTask = {
				taskId: item.id,
				status: title,
			};

			try {
				// 4. Логика уведомлений
				if (title === ITaskStatus.UNDER_REVIEW) {
					toast('Задача переведена на ПРОВЕРКУ - менеджер рассмотрит ее в ближайшее время', {
						icon: '🛠️',
						duration: 4000,
					});
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

				// 5. Обновление статуса задачи через Redux
				await dispatch(updateTaskStatus(updatedTask)).unwrap();
			} catch (error) {
				toast.error(error?.message || 'Ошибка при обновлении статуса задачи');
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));

	return (
		<div ref={drop} className={styles.column}>
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
