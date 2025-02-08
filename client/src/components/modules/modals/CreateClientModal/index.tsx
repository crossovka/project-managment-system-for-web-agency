import BaseModal from '@/components/elements/Modal';
import CreateClientForm from './CreateClientForm';

interface CreateClientModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
	isOpen,
	onClose,
}) => {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Create New Client"
			size="sm"
		>
			<CreateClientForm onClose={onClose} />
		</BaseModal>
	);
};

export default CreateClientModal;