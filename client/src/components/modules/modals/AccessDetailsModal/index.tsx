import BaseModal from '@/components/elements/Modal';
import AccessDetailsForm from './AccessDetailsForm';
import { IAccess } from '@/redux/slices/access/types';

interface AccessDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: number;
	selectedAccess: IAccess | null;
}

const AccessDetailsModal: React.FC<AccessDetailsModalProps> = ({
	isOpen,
	onClose,
	projectId,
	selectedAccess
}) => {
	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Добавить новый доступ"
			size="sm"
		>
			<AccessDetailsForm
				onClose={onClose}
				projectId={projectId}
				access={selectedAccess}
			/>
		</BaseModal>
	);
};

export default AccessDetailsModal;
