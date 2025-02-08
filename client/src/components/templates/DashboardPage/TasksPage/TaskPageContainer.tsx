import { toast } from 'react-hot-toast';
import TaskPageTemplate from './TaskPageTemplate';

interface TaskPageContainerProps {
	id: string;
	type: 'employee' | 'project' | 'assign-to-employee';
}

export function TaskPageContainer({ id, type }: TaskPageContainerProps) {
	if (!id) {
		toast.error('ID parameter is missing');
		return <div>Error: ID parameter is missing.</div>;
	}

	return <TaskPageTemplate id={id} type={type} />;
}
