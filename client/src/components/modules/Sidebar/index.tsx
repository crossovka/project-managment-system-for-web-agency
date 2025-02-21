'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import { logout } from '@/redux/slices/auth/slice';
import {
	isDirector,
	isManagerOrDirector,
} from '@/libs/utils/isManagerOrDirector';

import SidebarLink from './SidebarLink';

import ProfileIcon from './icons/ProfileIcon';
import TasksIcon from './icons/TasksIcon';
import EmployeesIcon from './icons/EmployeesIcon';
import ClientsIcon from './icons/ClientsIcon';
import ProjectsIcon from './icons/ProjectsIcon';
import WikiIcon from './icons/WikiIcon';
import LogoutIcon from './icons/LogoutIcon';

export const Sidebar = () => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);

	// useEffect(() => {
	// 	if (!currentUser) {
	// 		// Redirect to login if user is not authenticated
	// 		window.location.href = '/login';
	// 	}
	// }, [currentUser, dispatch]);

	if (!currentUser) {
		return <div>Loading...</div>;
	}

	// if (!currentUser) {
	// 	return <LoadingSpinner />;
	// }

	// Define all links, including conditional ones
	const sidebarLinks = [
		{ icon: <ProfileIcon />, href: '/profile', title: 'Профиль' },
		{
			icon: <TasksIcon />,
			href: `/tasks/employee/${currentUser.employee.employee_id}`,
			title: 'Задачи',
		},
		// Only show employees link for managers/directors
		...(isDirector(currentUser)
			? [{ icon: <ProjectsIcon />, href: '/projects', title: 'Проекты	' }]
			: []),
		...(isManagerOrDirector(currentUser)
			? [{ icon: <EmployeesIcon />, href: '/employees', title: 'Сотрудники' }]
			: []),
		...(isManagerOrDirector(currentUser)
			? [{ icon: <ClientsIcon />, href: '/clients', title: 'Клиенты' }]
			: []),
		{
			icon: <WikiIcon />,
			href: `/wiki/`,
			title: 'База знаний',
		},
		// {
		// 	icon: 'logout',
		// 	href: '',
		// 	title: 'Выход',
		// 	onClick: () => dispatch(logout()),
		// },
	];

	return (
		<aside className="sidebar">
			<div className="sidebar__inner">
				{/* <Link href="/" className="sidebar__logo -ibg_contain">
					<div className="sidebar__logo-img -ibg_contain">
						<Image src="/img/logo.svg" alt="Logo" fill />
					</div>
					<span>CRM Logo</span>
				</Link> */}
				<ul className="sidebar__links sidebar-links">
					{sidebarLinks.map((link, index) => (
						<SidebarLink
							key={index}
							icon={link.icon}
							href={link.href}
							title={link.title}
						/>
					))}
					<li
						className="sidebar-links__item"
						onClick={() => dispatch(logout())}
					>
						<a href="/login">
							<i>
								<LogoutIcon />
							</i>
							<span>выйти</span>
						</a>
					</li>
				</ul>
			</div>
		</aside>
	);
};
