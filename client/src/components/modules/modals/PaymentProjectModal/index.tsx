import React from 'react';
import { BaseModal } from '@/components/elements/Modal';
import PaymentProjectForm from './PaymentProjectForm';

interface PaymentProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
	totalTurnover: number;
	accountsReceivable: number;
}

export const PaymentProjectModal: React.FC<PaymentProjectModalProps> = ({
	isOpen,
	onClose,
	projectId,
	totalTurnover,
	accountsReceivable,
}) => {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Внести деньги по проекту"
		>
			<PaymentProjectForm
				onClose={onClose}
				projectId={projectId}
				totalTurnover={totalTurnover}
				accountsReceivable={accountsReceivable}
			/>
		</BaseModal>
	);
};

export default PaymentProjectModal;