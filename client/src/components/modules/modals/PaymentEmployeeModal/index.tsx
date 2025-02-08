import BaseModal from '@/components/elements/Modal';
import PaymentEmployeeForm from './PaymentEmployeeForm';

interface PaymentEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	pendingEarnings: number;
	totalEarnings: number;
	employeeId: number;
}

const PaymentEmployeeModal: React.FC<PaymentEmployeeModalProps> = ({
	isOpen,
	onClose,
	pendingEarnings,
	totalEarnings,
	employeeId,
}) => {
	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title="Заплатить сотруднику">
			<PaymentEmployeeForm
				onClose={onClose}
				pendingEarnings={pendingEarnings}
				totalEarnings={totalEarnings}
				employeeId={employeeId}
			/>
		</BaseModal>
	);
};

export default PaymentEmployeeModal;
