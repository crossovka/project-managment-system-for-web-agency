'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import ProfilePage from '@/components/templates/DashboardPage/ProfilePage';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const Profile = () => {
	const { id } = useParams(); // Получаем параметры через хук useParams

	// Преобразуем id в строку и затем в число
	const numericId = Number(Array.isArray(id) ? id[0] : id);

	// Проверяем, является ли ID числом
	if (isNaN(numericId)) {
		throw new Error('Неправильный формат id');
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ProfilePage viewEmployeeId={numericId} />
		</Suspense>
	);
};

export default Profile;
