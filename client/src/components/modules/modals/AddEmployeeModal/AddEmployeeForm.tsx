import toast from 'react-hot-toast';
import { useState } from 'react';

import { useAppDispatch } from '@/redux/store';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import EmployeeDropdown from '@/components/elements/Form/EmployeeDropdown';
import { addEmployeeToProject } from '@/redux/slices/project/asyncActions';

interface AddEmployeeFormProps {
	onClose: () => void;
	projectId: number;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose, projectId }) => {
	const dispatch = useAppDispatch();

	const [formState, setFormState] = useState({
		selectedEmployeeId: null as number | null,
	});

	// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value } = e.target;
	// 	setFormState((prevState) => ({
	// 		...prevState,
	// 		[name]: value,
	// 	}));
	// };

	const handleEmployeeChange = (employeeId: number | null) => {
		setFormState((prevState) => ({
			...prevState,
			selectedEmployeeId: employeeId,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formState.selectedEmployeeId) {
			toast.error('Please select an employee.');
			return;
		}

		try {
			await dispatch(
				addEmployeeToProject({
					employeeId: formState.selectedEmployeeId,
					projectId, // Прокиньте projectId из пропсов AddEmployeeForm
				})
			);
			toast.success('Employee added successfully.');
			onClose();
		} catch {
			toast.error('Ошибка добавления сотрудника.');
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<EmployeeDropdown
				selectedEmployeeId={formState.selectedEmployeeId}
				onChange={handleEmployeeChange}
				mode={'all'}
				title={"Добавить нового сотрудника на проект"}
			/>
		</BaseForm>
	);
};

export default AddEmployeeForm;
