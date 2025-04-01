'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import { TaskPageContainer } from '@/components/templates/DashboardPage/TasksPage/TaskPageContainer';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const TaskPage = () => {
	const { id } = useParams(); // Получаем параметр id через useParams

	// Преобразуем id в строку, если это массив строк или undefined
	const idString = Array.isArray(id) ? id[0] : id;

	// Проверка на отсутствие id (если параметр не найден)
	if (!idString) {
		throw new Error('Task ID is missing');
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<TaskPageContainer id={idString} type="project" />
		</Suspense>
	);
};

export default TaskPage;
