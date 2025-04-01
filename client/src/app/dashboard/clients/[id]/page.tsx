'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import ClientPage from '@/components/templates/DashboardPage/ClientPage';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const Client = () => {
	const { id } = useParams(); // Получаем параметры через хук useParams

	// Обрабатываем случай, если id это массив или пустой параметр
	const idString = Array.isArray(id) ? id[0] : id;

	if (!idString) {
		throw new Error('Неправильный айди или он отсутсвует');
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ClientPage id={idString} />
		</Suspense>
	);
};

export default Client;
