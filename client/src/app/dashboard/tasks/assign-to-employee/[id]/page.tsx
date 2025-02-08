import { TaskPageContainer } from '@/components/templates/DashboardPage/TasksPage/TaskPageContainer';
import { Suspense } from 'react';

interface TaskPageProps {
	params: {
		id: string;
	};
}

export default async function TaskPage({ params }: TaskPageProps) {
	const { id } = await Promise.resolve(params);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<TaskPageContainer id={id} type={"assign-to-employee"}/>
		</Suspense>
	);
}
