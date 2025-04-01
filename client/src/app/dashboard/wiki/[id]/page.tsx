'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import PostPage from '@/components/templates/DashboardPage/PostPage';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const Post = () => {
	const { id } = useParams(); // Получаем параметр id через useParams

	// Преобразуем id в строку, если это массив строк или undefined
	const idString = Array.isArray(id) ? id[0] : id;

	// Проверка на отсутствие id (если параметр не найден)
	if (!idString) {
		throw new Error('Post ID is missing');
	}

	// Преобразуем id в число
	const postId = Number(idString);

	// Проверка на то, что postId является числом
	if (isNaN(postId)) {
		throw new Error('Invalid Post ID');
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<PostPage postId={postId} />
		</Suspense>
	);
};

export default Post;
