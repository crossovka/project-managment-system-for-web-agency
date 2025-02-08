import BaseModal from '@/components/elements/Modal';
import ContactDetailsForm from './ContactDetailsForm';

interface ContactDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	clientId: number;
}

const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
	isOpen,
	onClose,
	clientId,
}) => {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Create New Client"
			size="sm"
		>
			<ContactDetailsForm onClose={onClose} clientId={clientId} />
		</BaseModal>
	);
};

export default ContactDetailsModal;
