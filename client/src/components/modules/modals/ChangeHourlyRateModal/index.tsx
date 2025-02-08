import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { updateHourlyRate } from '@/redux/slices/employee/asyncActions';

import BaseModal from '@/components/elements/Modal';
import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';


interface ChangeHourlyRateModalProps {
	isOpen: boolean;
	onClose: () => void;
	employeeId: number;
}

const ChangeHourlyRateModal: React.FC<ChangeHourlyRateModalProps> = ({
	isOpen,
	onClose,
	employeeId,
}) => {
	const dispatch = useAppDispatch();
	const [hourlyRate, setHourlyRate] = useState<number | null>(null);

	const handleSubmit = async () => {
		if (hourlyRate === null || hourlyRate <= 0) {
			toast.error('Почасовая ставка должна быть положительным числом');
			return;
		}
		try {
			await dispatch(
				updateHourlyRate({ employeeId, hourlyRate: hourlyRate as number })
			);
			toast.success('Почасовая ставка успешно обновлена');
			onClose();
		} catch (error) {
			toast.error('Ошибка при изменении почасовой ставки');
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Изменить почасовую ставку"
		>
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<FormField
					label="Новая почасовая ставка"
					name="hourlyRate"
					type="number"
					placeholder="Введите новую почасовую ставку"
					value={hourlyRate !== null ? hourlyRate : ''}
					onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
					required
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default ChangeHourlyRateModal;
