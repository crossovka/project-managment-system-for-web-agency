import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { createProject } from '@/redux/slices/project/asyncActions';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';
import EmployeeDropdown from '@/components/elements/Form/EmployeeDropdown';
import ClientsDropdown from '@/components/elements/Form/ClientsDropdown';
import EditorField from '@/components/elements/Form/EditorField';

import { IProject } from '@/redux/slices/project/types';
import { IProjectStatus } from '@/types/common';

interface CreateProjectFormProps {
	onClose: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onClose }) => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState<IProject>({
		name: '',
		startDate: new Date(),
		endDate: undefined,
		totalTurnover: undefined,
		accountsReceivable: undefined,
		status: IProjectStatus.IN_PROGRESS,
		client_id: 0,
		employees: [], // Список сотрудников, изначально пустой
		project_manager_id: 0,
		description: '',
		importantInfo: '',
	});

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === 'startDate' || name === 'endDate' ? new Date(value) : value,
		}));
	};

	// Обработчик для выбора проектного менеджера
	const handleManagerChange = (managerId: number | null) => {
		setFormData((prev) => ({
			...prev,
			project_manager_id: managerId || 0,
		}));
	};

	// Обработчик для изменения выбранного клиента
	const handleClientChange = (clientId: number | null) => {
		setFormData((prev) => ({
			...prev,
			client_id: clientId || 0,
		}));
	};

// 	const handleDescriptionChange = (value: string) => {
// 		setFormData((prev) => ({
// 				...prev,
// 				description: value,
// 		}));
// };

// const handleImportantInfoChange = (value: string) => {
// 		setFormData((prev) => ({
// 				...prev,
// 				importantInfo: value,
// 		}));
// };


	// Обработчик для поля выбора сотрудников
	const handleEmployeesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(e.target.selectedOptions);
		const selectedValues = selectedOptions.map((option) =>
			Number(option.value)
		);
		setFormData((prev) => ({
			...prev,
			employees: selectedValues,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Dispatch the create project action
			await dispatch(createProject(formData)).unwrap();
			toast.success('Project created successfully');
			onClose();
		} catch (error) {
			toast.error('Failed to create project');
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Название проекта"
				name="name"
				type="text"
				placeholder="Введите название проекта"
				value={formData.name}
				onChange={handleInputChange}
				required
			/>

			{/* <EditorField
				value={formData.description || ''}
				onChange={handleDescriptionChange}
				placeholder={'Введите описание проекта...'}
			/>

			<EditorField
				value={formData.importantInfo || ''}
				onChange={handleImportantInfoChange}
				placeholder={'Введите важную информацию...'}
			/> */}

				<FormField
					label="Описание"
					name="description"
					type="textarea"
					placeholder="Введите описание проекта"
					value={formData.description}
					onChange={handleInputChange}
				/>

				<FormField
					label="Важная информация"
					name="importantInfo"
					type="textarea"
					placeholder="Введите важную информацию"
					value={formData.importantInfo}
					onChange={handleInputChange}
				/>

			<FormField
				label="Дата начала"
				name="startDate"
				type="date"
				value={formData.startDate.toISOString().substring(0, 10)}
				onChange={handleInputChange}
				required
			/>

			<FormField
				label="Дата окончания"
				name="endDate"
				type="date"
				value={formData.endDate?.toISOString().substring(0, 10) || ''}
				onChange={handleInputChange}
			/>

			{/* <FormField
				label="Общий оборот"
				name="totalTurnover"
				type="number"
				placeholder="Введите общий оборот"
				value={formData.totalTurnover || ''}
				onChange={handleInputChange}
			/> */}

			{/* <FormField
				label="Дебиторская задолженность"
				name="accountsReceivable"
				type="number"
				placeholder="Введите дебиторскую задолженность"
				value={formData.accountsReceivable || ''}
				onChange={handleInputChange}
			/> */}

			{/* <FormField
				label="Статус"
				name="status"
				type="select"
				options={[
					{ value: IProjectStatus.ON_HOLD, label: 'На удержании' },
					{ value: IProjectStatus.IN_PROGRESS, label: 'В процессе' },
					{ value: IProjectStatus.COMPLETED, label: 'Завершен' },
				]}
				value={formData.status}
				onChange={handleInputChange}
				required
			/> */}

			{/* Используем EmployeeDropdown для выбора проектного менеджера */}
			<EmployeeDropdown
				selectedEmployeeId={formData.project_manager_id}
				onChange={handleManagerChange}
				mode="managers"
				title={'Выбирете проектнго менеджера'}
			/>

			<ClientsDropdown
				selectedClientId={formData.client_id}
				onChange={handleClientChange}
			/>
		</BaseForm>
	);
};

export default CreateProjectForm;
