import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';
import { addPaymentToProject } from '@/redux/slices/project/asyncActions';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';

interface PaymentProjectFormProps {
	onClose: () => void;
	projectId: number;
	// totalTurnover: number;
	accountsReceivable: number;
}

const PaymentProjectForm: React.FC<PaymentProjectFormProps> = ({
	onClose,
	projectId,
	// totalTurnover,
	accountsReceivable,
}) => {
	const dispatch = useAppDispatch();
	const [paymentAmount, setPaymentAmount] = useState<number>(0);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value);
		if (isNaN(value)) {
				setPaymentAmount(0);
				return;
		}
		if (value < 0) {
				toast.error('Значение не может быть отрицательным');
				return;
		}
		if (value > accountsReceivable) {
				toast.error('Сумма выплаты не может превышать дебиторскую задолженность');
				return;
		}
		setPaymentAmount(value);
};

	const handleSubmit = async () => {
		if (paymentAmount <= 0) {
			toast.error('Введите корректную сумму для выплаты');
			return;
		}
		if (paymentAmount > accountsReceivable) {
			toast.error('Сумма выплаты не может превышать дебиторскую задолженность');
			return;
		}
		try {
			await dispatch(addPaymentToProject({ projectId, amount: paymentAmount }));
			toast.success('Выплата по проекту успешно произведена!');
		} catch {
			toast.error('Ошибка при выплате по проекту!');
		} finally {
			onClose();
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Сумма к выплате"
				name="paymentAmount"
				type="number"
				placeholder="Введите сумму"
				value={paymentAmount || ''}
				onChange={handleInputChange}
				required
			/>
		</BaseForm>
	);
};

export default PaymentProjectForm;
