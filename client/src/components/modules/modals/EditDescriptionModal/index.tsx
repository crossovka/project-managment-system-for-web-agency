import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { updateProjectDescription } from '@/redux/slices/project/asyncActions';

import { BaseModal } from '@/components/elements/Modal';
import { FormField } from '@/components/elements/Form/FormField';
import { BaseForm } from '@/components/elements/Form/BaseForm';

interface EditDescriptionModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
	currentDescription: string;
}

const EditDescriptionModal: React.FC<EditDescriptionModalProps> = ({
	isOpen,
	onClose,
	projectId,
	currentDescription,
}) => {
	const dispatch = useAppDispatch();
	const [description, setDescription] = useState<string>(currentDescription);

	
	const handleSubmit = async () => {
		if (!description) {
				toast.error('Описание не может быть пустым');
				return;
		}
		try {
				await dispatch(updateProjectDescription({ projectId, description }));
				toast.success('Описание успешно обновлено!');
				onClose();
		} catch (error) {
				toast.error('Ошибка при обновлении описания');
		}
};


	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title="Редактировать описание">
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<FormField
					label="Описание проекта"
					name="description"
					type="textarea"
					placeholder="Введите описание"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default EditDescriptionModal;
