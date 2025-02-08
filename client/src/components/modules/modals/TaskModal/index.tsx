import { BaseModal } from '@/components/elements/Modal';
import TaskForm from './TaskForm';

import { ITask } from '@/redux/slices/tasks/types';
import { IEmployee } from '@/redux/slices/auth/types';

interface TaskModalProps {
	task?: ITask | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (updatedTask: Partial<ITask>) => void;
	creatorId: number;
	type: 'employee' | 'project' | 'assign-to-employee';
	user: IEmployee;
	id: number;
}

const TaskModal: React.FC<TaskModalProps> = ({
	task,
	isOpen,
	onClose,
	onSave,
	creatorId,
	type,
	user,
	id
}) => {
	console.log('Task passed to modal:', task);
	console.log(`type ${type}{}`)
	const modalTitle =
		task && task.title
			? task.title
			: `Новая задача со статусом ${task?.status}`;
	return (
		<BaseModal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
			<TaskForm
				task={task}
				onSave={onSave}
				onClose={onClose}
				creatorId={creatorId}
				type={type}
				user={user}
				id={id}
			/>
			{/* {task ? (
				<TaskFormEdit task={task} onSave={onSave} onClose={onClose} />
			) : (
				<TaskFormCreate onSave={onSave} onClose={onClose} />
			)} */}
		</BaseModal>
	);
};

export default TaskModal;
