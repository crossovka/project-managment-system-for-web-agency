'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { createAccess, updateAccess } from '@/redux/slices/access/asyncActions';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';
import { IAccess } from '@/redux/slices/access/types';
import { fetchProjectById } from '@/redux/slices/project/asyncActions';

// Form Component for Creating Access Details
interface AccessDetailsFormProps {
	onClose: () => void;
	projectId: number;
	access?: IAccess | null;
}

const AccessDetailsForm: React.FC<AccessDetailsFormProps> = ({
	onClose,
	projectId,
	access,
}) => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState({
		resourceName: access?.resourceName || '',
		login: access?.login || '',
		password: access?.password || '',
		projectId: projectId,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			if (access) {
				// Передаем только accessId и обновленные данные
				const { access_id, ...updatedAccessData } = { ...access, ...formData };
				await dispatch(
					updateAccess({ accessId: access_id, updates: updatedAccessData })
				).unwrap();
				// Перезагружаем данные проекта
				dispatch(fetchProjectById(+projectId));
				toast.success('Access updated successfully');
			} else {
				// Создание нового доступа
				await dispatch(createAccess(formData)).unwrap();
				// Перезагружаем данные проекта
				dispatch(fetchProjectById(+projectId));
				toast.success('Access created successfully');
			}
			onClose();
		} catch (error) {
			toast.error('Failed to save access details');
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Название ресурса"
				name="resourceName"
				value={formData.resourceName}
				onChange={handleChange}
				required
			/>
			<FormField
				label="Логин"
				name="login"
				value={formData.login}
				onChange={handleChange}
				required
			/>
			<FormField
				label="Пароль"
				name="password"
				value={formData.password}
				onChange={handleChange}
				type="password"
				required
			/>
		</BaseForm>
	);
};

export default AccessDetailsForm;
