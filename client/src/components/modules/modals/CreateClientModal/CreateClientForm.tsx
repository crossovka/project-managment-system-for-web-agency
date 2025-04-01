import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { createClient } from '@/redux/slices/clients/asyncActions';

import { FormField } from '@/components/elements/Form/FormField';
import { BaseForm } from '@/components/elements/Form/BaseForm';

interface CreateClientFormProps {
	onClose: () => void;
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ onClose }) => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState({
		companyName: '',
		contactDetails: [{ contactPerson: '', contactInfo: '' }],
	});

	const handleSubmit = async () => {
		try {
			await dispatch(createClient(formData)).unwrap();
			toast.success('Client created successfully');
			onClose();
		} catch {
			toast.error('Ошибка создания клиента');
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Название компании"
				name="companyName"
				value={formData.companyName}
				onChange={(e) =>
					setFormData({ ...formData, companyName: e.target.value })
				}
				required
			/>
			{formData.contactDetails.map((contact, index) => (
				<>
					<FormField
						label="Человек для контакта"
						name="contactPerson"
						value={contact.contactPerson}
						onChange={(e) => {
							const newContactDetails = [...formData.contactDetails];
							newContactDetails[index].contactPerson = e.target.value;
							setFormData({ ...formData, contactDetails: newContactDetails });
						}}
						required
					/>
					<FormField
						label="Контактная информация"
						name="contactInfo"
						value={contact.contactInfo}
						onChange={(e) => {
							const newContactDetails = [...formData.contactDetails];
							newContactDetails[index].contactInfo = e.target.value;
							setFormData({ ...formData, contactDetails: newContactDetails });
						}}
						required
					/>
				</>
			))}
		</BaseForm>
	);
};

export default CreateClientForm;
