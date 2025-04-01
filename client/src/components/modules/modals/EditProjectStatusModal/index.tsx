import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { updateProjectStatus } from '@/redux/slices/project/asyncActions';

import { BaseModal } from '@/components/elements/Modal';
import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';

import { IProjectStatus } from '@/types/common';

interface EditProjectStatusModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
	currentStatus: IProjectStatus;
}

const EditProjectStatusModal: React.FC<EditProjectStatusModalProps> = ({
	isOpen,
	onClose,
	projectId,
	currentStatus,
}) => {
	const dispatch = useAppDispatch();
	const [status, setStatus] = useState<IProjectStatus>(currentStatus);

	const handleSubmit = async () => {
		if (!status) {
			toast.error('Статус не может быть пустым');
			return;
		}
		try {
			await dispatch(updateProjectStatus({ projectId, status }));
			toast.success('Статус проекта успешно обновлен!');
			onClose();
		} catch {
			toast.error('Ошибка при обновлении статуса');
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Изменить статус проекта"
		>
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<FormField
					label="Статус проекта"
					name="status"
					type="select"
					options={[
						{ value: IProjectStatus.IN_PROGRESS, label: 'В процессе' },
						{ value: IProjectStatus.COMPLETED, label: 'Завершен' },
						{ value: IProjectStatus.CANCELED, label: 'Отменен' },
						{ value: IProjectStatus.ON_HOLD, label: 'Приостановлен' },
					]}
					value={status}
					onChange={(e) => setStatus(e.target.value as IProjectStatus)}
					required
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default EditProjectStatusModal;
