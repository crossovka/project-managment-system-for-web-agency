'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { closeTaskModal } from '@/redux/slices/tasks/slice';
import {
	selectCurrentTask,
	selectIsTaskModalOpen,
	selectTasks,
	selectTasksError,
	selectTasksLoading,
} from '@/redux/slices/tasks/selectors';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import {
	createTask,
	fetchTasksByEmployeeId,
	fetchTasksByProjectId,
	updateTask,
} from '@/redux/slices/tasks/asyncActions';
import {
	selectProjectLoading,
	selectProjectName,
} from '@/redux/slices/project/selectors';
import { fetchProjectNameById } from '@/redux/slices/project/asyncActions';
import {
	selectEmployeeLoading,
	selectEmployeeName,
} from '@/redux/slices/employee/selectors';
import { fetchEmployeeName } from '@/redux/slices/employee/asyncActions';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import Board from '@/components/modules/Board/Board';
import TaskModal from '@/components/modules/modals/TaskModal';

import { ITaskStatus } from '@/types/common';
import { ITask } from '@/redux/slices/tasks/types';
import styles from './TasksPageTemplate.module.scss';

interface TaskPageTemplateProps {
	id: string;
	type: 'employee' | 'project' | 'assign-to-employee'; // Тип (по сотруднику или проекту)
}

const TaskPageTemplate: React.FC<TaskPageTemplateProps> = ({ id, type }) => {
	const dispatch = useAppDispatch();
	const tasks = useAppSelector(selectTasks);
	const loading = useAppSelector(selectTasksLoading);
	const error = useAppSelector(selectTasksError);

	const IsTaskModalOpen = useAppSelector(selectIsTaskModalOpen);
	const currentTask = useAppSelector(selectCurrentTask);

	const currentUser = useAppSelector(selectCurrentUser);
	const creatorId = currentUser?.employee?.employee_id;
	const employeeName = useAppSelector(selectEmployeeName);
	const employeeLoading = useAppSelector(selectEmployeeLoading);

	const projectLoading = useAppSelector(selectProjectLoading);
	const projectName = useAppSelector(selectProjectName);

	// const { isOpen, currentTask } = useAppSelector();

	useEffect(() => {
		// console.log(currentUser)
		// В зависимости от типа (сотрудник или проект) загружаем соответствующие задачи
		if (type === 'employee') {
			dispatch(fetchTasksByEmployeeId(Number(id)));
			dispatch(fetchEmployeeName(Number(id))); // Загружаем имя сотрудника
		} else if (type === 'assign-to-employee') {
			dispatch(fetchTasksByEmployeeId(Number(id)));
			dispatch(fetchEmployeeName(Number(id))); // Загружаем имя сотрудника
		} else if (type === 'project') {
			dispatch(fetchTasksByProjectId(Number(id)));
			dispatch(fetchProjectNameById(Number(id)));
		}
	}, [dispatch, id, type]);

	const handleTaskSave = async (updates: Partial<ITask>) => {
		if (!currentTask) return;

		try {
			await dispatch(
				updateTask({
					taskId: currentTask.task_id,
					updates,
				})
			).unwrap();

			toast.success('Задача успешно обновлена');
			dispatch(closeTaskModal());
		} catch {
			toast.error('Ошибка при обновлении задачи');
		}
	};

	const handleCreateTask = async (newTask: Partial<ITask>) => {
		try {
			await dispatch(
				createTask({
					...newTask,
					project_id: type === 'project' ? Number(id) : undefined,
					assignee_id: assigneeId,
					creator_id: creatorId,
				})
			).unwrap();
			toast.success('Задача успешно создана');
			dispatch(closeTaskModal());
		} catch {
			toast.error('Ошибка при создании задачи');
		}
	};

	// const onSaveHandler = (updates: Partial<ITask>) => {
	// 	if (currentTask?.task_id) {
	// 		// Если задача существует и имеет task_id, обновляем задачу
	// 		handleTaskSave(updates);
	// 	} else {
	// 		// Если task_id нет, создаем новую задачу
	// 		handleCreateTask(updates);
	// 	}
	// };

	// Логика для creatorId и assigneeId
	const assigneeId = type === 'assign-to-employee' ? Number(id) : undefined;

	const creatorIdForTask = creatorId; // Используем ID текущего пользователя

	// если тип 'assign-to-employee', то передаем assigneeId как ID сотрудника, которому назначена задача
	const onSaveHandlerWithAssignee = (updates: Partial<ITask>) => {
		if (currentTask?.task_id) {
			handleTaskSave({
				...updates,
				creator_id: creatorIdForTask,
				assignee_id: assigneeId,
			});
		} else {
			handleCreateTask({
				...updates,
				creator_id: creatorIdForTask,
				assignee_id: assigneeId,
			});
		}
	};

	// if (loading || !currentTask) return <LoadingSpinner />;
	if (loading || (type === 'project' && projectLoading))
		return <LoadingSpinner />;
	if (error) return <div className={styles.error}>Error: {error}</div>;

	// const columns = createColumns(tasks ?? []);
	// Проверяем, если задач нет, но колонки все равно создаем
	const columns = createColumns(tasks);

	return (
		<>
			<DndProvider backend={HTML5Backend}>
				<div className={styles.taskPage}>
					<header className={styles.header}>
						{type === 'employee' && employeeLoading && (
							<p>Загрузка имени сотрудника...</p>
						)}
						{/* <h1>
							{type === 'employee'
								? `Задачи для сотрудника: ${employeeName || 'Имя не найдено'}`
								: `Задачи для проекта ${projectName}`}
						</h1> */}
						<h1>
							{type === 'employee'
								? `Задачи для: ${employeeName || 'Имя не найдено'}`
								: type === 'assign-to-employee'
								? `Задачи для сотрудника: ${employeeName || 'Имя не найдено'}`
								: `Задачи для проекта: ${
										projectName || 'Название проекта не найдено'
								  }`}
						</h1>
					</header>
					<Board columns={columns} />
				</div>
			</DndProvider>
			<TaskModal
				isOpen={IsTaskModalOpen}
				task={currentTask || null} // Передаем null, если currentTask отсутствует
				onClose={() => dispatch(closeTaskModal())}
				onSave={onSaveHandlerWithAssignee}
				creatorId={creatorId}
				type={type}
				user={currentUser}
				id={id}
			/>
		</>
	);
};

export default TaskPageTemplate;

const createColumns = (tasks: ITask[] | null) => {
	const statuses = [
		ITaskStatus.IN_PROGRESS,
		ITaskStatus.URGENT,
		ITaskStatus.UNDER_REVIEW,
		ITaskStatus.COMPLETED,
	];

	// Если задач нет, возвращаем пустые колонки для каждого статуса
	return statuses.map((status) => ({
		title: status,
		tasks: tasks ? tasks.filter((task) => task.status === status) : [],
	}));
};
