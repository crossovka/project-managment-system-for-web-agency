import BaseModal from "@/components/elements/Modal";
import CreateEmployeeForm from "./CreateEmployeeForm";

interface CreateEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
	isOpen,
	onClose,
}) => {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Create New Employee"
			size="md"
		>
			< CreateEmployeeForm onClose={onClose} />
		</BaseModal>
	);
};

export default CreateEmployeeModal;