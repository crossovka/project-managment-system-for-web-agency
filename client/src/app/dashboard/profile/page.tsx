import ProfilePage from '@/components/templates/DashboardPage/ProfilePage';

export default function Profile({
	viewEmployeeId,
}: {
	viewEmployeeId?: number;
}) {
	return <ProfilePage viewEmployeeId={viewEmployeeId} />;
}
