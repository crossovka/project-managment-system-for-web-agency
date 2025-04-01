'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation'; // Хук для получения параметров из URL

import ProjectPage from '@/components/templates/DashboardPage/ProjectPage';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const Project = () => {
	const { id } = useParams(); // Получаем параметр id через useParams

	// Преобразуем id в строку, если это массив или undefined
	const idString = Array.isArray(id) ? id[0] : id;

	// Если id не найдено, можно выбросить ошибку или обработать по-другому
	if (!idString) {
		throw new Error('Нет айди проекта');
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ProjectPage id={idString} />
		</Suspense>
	);
};

export default Project;
