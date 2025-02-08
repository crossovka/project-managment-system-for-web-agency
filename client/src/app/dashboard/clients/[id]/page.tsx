import ClientPage from '@/components/templates/DashboardPage/ClientPage';

const Client = ({ params }: { params: { id: string } }) => {
	const { id } = params; // Получаем id из параметров маршрута

	return <ClientPage id={id} />;
};
export default Client;
