import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/redux/store';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';
import { payEmployee } from '@/redux/slices/employee/asyncActions';

interface PaymentEmployeeFormProps {
	onClose: () => void;
	pendingEarnings: number;
	// totalEarnings: number;
	employeeId: number;
}

const PaymentEmployeeForm: React.FC<PaymentEmployeeFormProps> = ({
	// isOpen,
	onClose,
	pendingEarnings,
	// totalEarnings,
	employeeId,
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
		if (value > pendingEarnings) {
			toast.error('Сумма выплаты не может превышать сумму к получению');
			return;
		}
		setPaymentAmount(value);
	};

	const handleSubmit = async () => {
		if (paymentAmount > pendingEarnings) {
			toast.error('Сумма выплаты не может превышать сумму к получению');
			return;
		}
		if (paymentAmount > 0) {
			try {
				await dispatch(payEmployee({ employeeId, amount: paymentAmount }));
				toast.success('Выплата успешно произведена!');
			} catch {
				toast.error('Ошибка при выплате!');
			} finally {
				onClose();
			}
		} else {
			toast.error('Введите корректную сумму для выплаты');
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

export default PaymentEmployeeForm;
