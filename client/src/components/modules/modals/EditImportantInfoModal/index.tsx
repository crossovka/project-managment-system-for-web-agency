import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { updateProjectImportantInfo } from '@/redux/slices/project/asyncActions';

import { BaseModal } from '@/components/elements/Modal';
import { FormField } from '@/components/elements/Form/FormField';
import { BaseForm } from '@/components/elements/Form/BaseForm';

interface EditImportantInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
	currentImportantInfo: string;
}

const EditImportantInfoModal: React.FC<EditImportantInfoModalProps> = ({
	isOpen,
	onClose,
	projectId,
	currentImportantInfo,
}) => {
	const dispatch = useAppDispatch();
	const [importantInfo, setImportantInfo] =
		useState<string>(currentImportantInfo);

	const handleSubmit = async () => {
		if (!importantInfo) {
			toast.error('Важная информация не может быть пустой');
			return;
		}
		try {
			await dispatch(updateProjectImportantInfo({ projectId, importantInfo }));
			toast.success('Важная информация успешно обновлена!');
			onClose();
		} catch {
			toast.error('Ошибка при обновлении важной информации');
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Редактировать важную информацию"
		>
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<FormField
					label="Важная информация"
					name="importantInfo"
					type="textarea"
					placeholder="Введите важную информацию"
					value={importantInfo}
					onChange={(e) => setImportantInfo(e.target.value)}
					required
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default EditImportantInfoModal;
