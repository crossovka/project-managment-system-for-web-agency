import { Suspense } from 'react';
import PostPage from '@/components/templates/DashboardPage/PostPage';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

interface PostPageProps {
	params: {
		id: string;
	};
}

export default async function Post({ params }: PostPageProps) {
	const { id } = await Promise.resolve(params);

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<PostPage postId={id} />
		</Suspense>
	);
}
