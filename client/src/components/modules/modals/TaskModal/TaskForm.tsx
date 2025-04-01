import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';
import EditorField from '@/components/elements/Form/EditorField';
import EmployeeDropdown from '@/components/elements/Form/EmployeeDropdown';
import ProjectDropdown from '@/components/elements/Form/ProjectDropdown/ index';

import { isManagerOrDirector } from '@/libs/utils/isManagerOrDirector';

import { ITaskStatus, WorkType } from '@/types/common';
import { ITask } from '@/redux/slices/tasks/types';
import { IEmployee } from '@/redux/slices/auth/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchHourlyRate } from '@/redux/slices/employee/asyncActions';
import { selectHourlyRate } from '@/redux/slices/employee/selectors';

interface TaskFormProps {
	task?: ITask;
	onSave: (task: Partial<ITask>) => void;
	onClose: () => void;
	creatorId: number;
	type: 'employee' | 'project' | 'assign-to-employee'; // Задачи самого сотрудника | Задачи по проекту | Задачи другого сотрудника
	user: IEmployee;
	id: number;
}

const TaskForm: React.FC<TaskFormProps> = ({
	task,
	onSave,
	onClose,
	creatorId,
	type,
	user,
	id,
}) => {
	const dispatch = useAppDispatch();
	const isEditing = Boolean(task?.task_id);
	const hourlyRate = useAppSelector(selectHourlyRate);

	const [formData, setFormData] = useState<Partial<ITask>>({
		title: task?.title || '',
		status: task?.status || ITaskStatus.IN_PROGRESS,
		description: task?.description || '',
		workType: task?.workType || WorkType.PROJECT_BASED,
		hours: task?.hours || 0,
		minutes: task?.minutes || 0,
		cost: task?.cost || '',
		project_id: task?.project_id || '',
		assignedTo:
			task?.assignedTo ||
			(type === 'assign-to-employee' ? Number(id) : creatorId),
		startDate: task?.startDate || '',
		dueDate: task?.dueDate || '',
		createdBy: creatorId, // Используем creatorId для поля createdBy
	});

	// Track selected employee
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
		null
	);

	const handleEmployeeChange = (employeeId: number | null) => {
		setSelectedEmployeeId(employeeId);
	};

	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
		task?.project_id || null
	);

	const handleProjectChange = (projectId: number | null) => {
		setSelectedProjectId(projectId);
	};

	const calculateCost = useCallback(() => {
		const rate = hourlyRate ?? 0; // Подставляем 0, если hourlyRate = null
		const totalHours = Number(formData.hours) + Number(formData.minutes) / 60;
		return (totalHours * rate).toFixed(2);
	}, [formData.hours, formData.minutes, hourlyRate]);

	useEffect(() => {
		if (formData.workType === WorkType.HOURLY_BASED) {
			setFormData((prev) => ({
				...prev,
				cost: calculateCost(),
			}));
		}
	}, [calculateCost, formData.hours, formData.minutes, formData.workType]);

	const handleDescriptionChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			description: value,
		}));
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		// Проверка на отрицательные значения
		if (
			(name === 'hours' || name === 'minutes' || name === 'cost') &&
			parseFloat(value) < 0
		) {
			toast.error('Значение не может быть отрицательным');
			return;
		}

		setFormData((prev) => ({
			...prev,
			[name]:
				name === 'hours' || name === 'minutes' || name === 'assignedTo'
					? Number(value)
					: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Проверка на отрицательные значения
		if (
			(name === 'hours' || name === 'minutes' || name === 'cost') &&
			(isNaN(parseFloat(value)) || parseFloat(value) < 0)
		) {
			toast.error('Значение не может быть отрицательным или не числом');
			return;
		}

		const taskData: Partial<ITask> = {
			...formData,
			cost:
				formData.workType === WorkType.HOURLY_BASED
					? parseFloat(calculateCost())
					: parseFloat(formData.cost || '0'),
			project_id:
				type === 'project'
					? parseInt(formData.project_id || '0', 10)
					: undefined,
			// assignedTo: selectedEmployeeId !== null && selectedEmployeeId !== undefined ? selectedEmployeeId : creatorId,
			// Логика для назначения задачи в зависимости от типа страницы и роли пользователя
			assignedTo:
				task?.assignedTo ||
				(type === 'assign-to-employee'
					? Number(id)
					: type === 'project'
					? isManagerOrDirector(user)
						? selectedEmployeeId
						: creatorId
					: creatorId),
		};

		if (!isEditing) {
			delete taskData.task_id; // Убираем task_id для новой задачи
		}

		onSave(taskData);
	};

	useEffect(() => {
		if (type === 'employee') {
			dispatch(fetchHourlyRate(creatorId));
		} else if (type === 'project') {
			if (isManagerOrDirector(user)) {
				if (selectedEmployeeId) {
					dispatch(fetchHourlyRate(selectedEmployeeId));
				}
			} else {
				dispatch(fetchHourlyRate(creatorId));
			}
		} else if (type === 'assign-to-employee') {
			dispatch(fetchHourlyRate(Number(id)));
		}
	}, [dispatch, type, creatorId, user, id, selectedEmployeeId]);

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Название задачи"
				name="title"
				type="text"
				placeholder="Введите название задачи"
				value={formData.title || ''}
				onChange={handleInputChange}
				required
			/>

			{/* <FormField
				label="Описание"
				name="description"
				type="textarea"
				placeholder="Введите описание задачи"
				value={formData.description || ''}
				onChange={handleInputChange}
			/> */}

			<EditorField
				value={formData.description || ''}
				onChange={handleDescriptionChange}
				placeholder={'Введите описание задачи...'}
			/>

			<FormField
				label="Тип работы"
				name="workType"
				type="select"
				options={[
					{ value: WorkType.PROJECT_BASED, label: 'Проектная работа' },
					{ value: WorkType.HOURLY_BASED, label: 'Почасовая работа' },
				]}
				value={formData.workType}
				onChange={handleInputChange}
				required
			/>

			{formData.workType === WorkType.HOURLY_BASED && (
				<>
					<FormField
						label="Часы"
						name="hours"
						type="number"
						placeholder="0"
						value={formData.hours}
						onChange={handleInputChange}
						required
					/>
					<FormField
						label="Минуты"
						name="minutes"
						type="number"
						placeholder="0"
						value={formData.minutes}
						onChange={handleInputChange}
						required
					/>
					<FormField
						label="Стоимость"
						name="cost"
						type="text"
						value={formData.cost || ''}
						disabled
						required
					/>
				</>
			)}

			{formData.workType === WorkType.PROJECT_BASED && (
				<FormField
					label="Стоимость проекта"
					name="cost"
					type="number"
					placeholder="Введите стоимость проекта"
					value={formData.cost || ''}
					onChange={handleInputChange}
				/>
			)}

			<FormField
				label="Дата начала"
				name="startDate"
				type="date"
				value={formData.startDate || ''}
				onChange={handleInputChange}
				required
			/>
			<FormField
				label="Дата окончания"
				name="dueDate"
				type="date"
				value={formData.dueDate || ''}
				onChange={handleInputChange}
				required
			/>

			{(type === 'employee' || type === 'assign-to-employee') && !isEditing && (
				// <FormField
				// 	label="Проект"
				// 	name="project_id"
				// 	type="number"
				// 	placeholder="ID проекта"
				// 	value={formData.project_id || ''}
				// 	onChange={handleInputChange}
				// 	required
				// />
				<ProjectDropdown
					selectedProjectId={selectedProjectId}
					onChange={handleProjectChange}
					userId={
						type === 'employee'
							? creatorId
							: type === 'assign-to-employee'
							? Number(id)
							: 0 // Значение по умолчанию, если type не подходит
					}
				/>
			)}

			{isManagerOrDirector(user) && !isEditing && type == 'project' && (
				<EmployeeDropdown
					selectedEmployeeId={selectedEmployeeId} // Передаем ID выбранного сотрудника
					onChange={handleEmployeeChange} // Передаем функцию, которая обновит выбранного сотрудника
					mode={type === 'project' ? 'project' : undefined}
					projectId={type === 'project' ? Number(id) : undefined}
					// projectId={task?.project_id || selectedProjectId}
				/>
			)}
		</BaseForm>
	);
};

export default TaskForm;
