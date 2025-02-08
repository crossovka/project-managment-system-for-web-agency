import ProjectPage from '@/components/templates/DashboardPage/ProjectPage';

const Project = ({ params }: { params: { id: string } }) => {
	const { id } = params; // Получаем id из параметров маршрута

	return <ProjectPage id={id} />;
};
export default Project;
