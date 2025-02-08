import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
