import toast from 'react-hot-toast';
import { useState } from 'react';

import { updateProjectManager } from '@/redux/slices/project/asyncActions';
import { useAppDispatch } from '@/redux/store';

import BaseModal from '@/components/elements/Modal';
import { BaseForm } from '@/components/elements/Form/BaseForm';
import EmployeeDropdown from '@/components/elements/Form/EmployeeDropdown';

interface UpdateProjectManagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: number;
}

const UpdateProjectManagerModal: React.FC<UpdateProjectManagerModalProps> = ({
	isOpen,
	onClose,
	projectId,
}) => {
	const dispatch = useAppDispatch();
	const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
		null
	);

	const handleManagerChange = (managerId: number | null) => {
		setSelectedManagerId(managerId);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedManagerId) {
			toast.error('Please select a manager.');
			return;
		}

		try {
			await dispatch(
				updateProjectManager({ projectId, managerId: selectedManagerId })
			);
			toast.success('Project manager updated successfully.');
			onClose();
		} catch (error) {
			toast.error('Failed to update project manager.');
		}
	};

	
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Сменить проджекта"
			size="md"
		>
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<EmployeeDropdown
					selectedEmployeeId={selectedManagerId}
					onChange={handleManagerChange}
					mode={'managers'}
					title={"Выбирете нового проектного менеджера"}
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default UpdateProjectManagerModal;
