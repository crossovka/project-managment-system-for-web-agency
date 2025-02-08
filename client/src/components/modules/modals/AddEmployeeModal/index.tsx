import BaseModal from '@/components/elements/Modal';
import AddEmployeeForm from './AddEmployeeForm';

interface AddEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
	isOpen,
	onClose,
	projectId,
}) => {

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Добавить сотрудника на проект"
			size="md"
		>
			<AddEmployeeForm onClose={onClose} projectId={projectId} />
		</BaseModal>
	);
};

export default AddEmployeeModal;
