import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { createCategory } from '@/redux/slices/categories/asyncActions';

import BaseModal from '@/components/elements/Modal';
import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';

interface CategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
	const dispatch = useAppDispatch();

	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Проверка полей
		if (!name) {
			toast.error('Название категории обязательно');
			return;
		}

		const newCategory = {
			name,
			description,
		};

		try {
			// Диспатчим действие для создания категории
			await dispatch(createCategory(newCategory)).unwrap();
			toast.success('Категория успешно создана');
			onClose(); // Закрываем модалку
		} catch (error: any) {
			console.error(error);
			toast.error('Ошибка при создании категории');
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Создать новую категорию"
			size="md"
		>
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<FormField
					label="Название категории"
					name="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<FormField
					label="Описание"
					name="description"
					type="textarea"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default CategoryModal;
