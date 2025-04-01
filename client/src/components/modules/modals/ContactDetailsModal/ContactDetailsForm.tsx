import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { createContactDetails } from '@/redux/slices/clients/asyncActions';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';

import { IContactDetails } from '@/redux/slices/clients/types';

interface ContactDetailsFormProps {
	onClose: () => void;
	clientId: number;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
	onClose,
	clientId,
}) => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState<IContactDetails>({
		contactPerson: '',
		contactInfo: '',
		client_id: clientId,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			// Добавляем clientId в запрос
			await dispatch(createContactDetails(formData)).unwrap();
			toast.success('Contact details created successfully');
			onClose();
		} catch {
			toast.error('Ошибка при создании контактной информации');
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Человек для контакта"
				name="contactPerson"
				value={formData.contactPerson}
				onChange={handleChange}
				required
			/>
			<FormField
				label="Контактная информация"
				name="contactInfo"
				value={formData.contactInfo}
				onChange={handleChange}
				required
			/>
		</BaseForm>
	);
};

export default ContactDetailsForm;
