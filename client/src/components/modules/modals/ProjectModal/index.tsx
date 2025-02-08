import BaseModal from '@/components/elements/Modal';
import CreateProjectForm from './CreateProjectForm';

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
	isOpen,
	onClose,
}) => {
	return (
			<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Создать новый проект"
			size="md"
		>
			<CreateProjectForm onClose={onClose} />
	</BaseModal>
	);
};

export default CreateProjectModal;
