import { Suspense } from 'react';
import ProfilePage from '@/components/templates/DashboardPage/ProfilePage';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

interface ProfilePageProps {
	params: {
		id: string;
	};
}

export default async function Profile({ params }: ProfilePageProps) {
	const { id } = await Promise.resolve(params);

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ProfilePage viewEmployeeId={id} />
		</Suspense>
	);
}
