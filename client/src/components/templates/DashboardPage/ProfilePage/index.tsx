'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectAuthState, selectEmployeeProfile } from '@/redux/slices/auth/selectors';
import { fetchCurrentUserProfile, fetchEmployeeProfile } from '@/redux/slices/auth/asyncActions';
// import { logout } from '@/redux/slices/auth/slice';

import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import { isDirector } from '@/libs/utils/isManagerOrDirector';
import { formatCurrency } from '@/libs/utils/common';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import Tabs from '@/components/elements/Tabs';
import EmployeeItem from '@/components/elements/EmployeeItem';
import PaymentEmployeeModal from '@/components/modules/modals/PaymentEmployeeModal';
import ChangeHourlyRateModal from '@/components/modules/modals/ChangeHourlyRateModal';

import CoinIcon from './icons/CoinIcon';
import WalletIcon from './icons/WalletIcon';
import MonthIcon from './icons/MonthIcon';
import HoursIcon from './icons/HoursIcon';
import BonusIcon from './icons/BonusIcon';

import styles from './ProfilePage.module.scss';

interface ProfilePageProps {
	viewEmployeeId?: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ viewEmployeeId }) => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);
	const employeeProfile = useAppSelector(selectEmployeeProfile);
	const { profileLoading } = useAppSelector(selectAuthState);

	// Локальное состояние для активного статуса
	const [activeStatus, setActiveStatus] = useState<string>('Все');
	const [isModalOpen, setModalOpen] = useState(false);
	const [isChangeRateModalOpen, setChangeRateModalOpen] = useState(false);

	// useEffect(() => {
	// 	// Получаем employeeId из параметров маршрута или используем текущего пользователя
	// 	const fetchProfileData = async () => {
	// 		const employeeId = viewEmployeeId || undefined; // viewEmployeeId — это ID профиля, который нужно загрузить
	// 		dispatch(fetchProfile(employeeId));
	// 	};

	// 	fetchProfileData();
	// }, [dispatch, viewEmployeeId]);

	useEffect(() => {
		if (!viewEmployeeId) {
				dispatch(fetchCurrentUserProfile());
		} else {
				dispatch(fetchEmployeeProfile(viewEmployeeId));
		}
}, [dispatch, viewEmployeeId])

		// if (profileLoading) {
		// 	return <LoadingSpinner />;
		// }

		// Определяем, чей профиль отображается
		const profile = viewEmployeeId ? employeeProfile : currentUser;

		if (!profile) {
			return <LoadingSpinner />;
		}

	// Деструктуризация данных сотрудника и статистики
	const { employee_id, name, position, department, hourlyRate } = profile.employee || {};
	const { totalEarnings, pendingEarnings, monthlyEarnings, hoursWorked } =
	profile.employeeStatistic || {};

	const employeeInItem = { name, position, department };

	const projects = profile.employee?.projects || []; // Извлечение проектов

	// Уникальные статусы проектов
	const projectStatuses = [
		'Все',
		...new Set(projects.map((project) => project.status)),
	];

	// Фильтрация проектов по активному статусу
	const filteredProjects =
		activeStatus === 'Все'
			? projects
			: projects.filter((project) => project.status === activeStatus);

	console.log('currentUser:', currentUser);
	console.log('isDirector:', isDirector(currentUser));
	console.log('viewEmployeeId:', viewEmployeeId);

	return (
		<div className={styles.profile}>
				<div className={styles.profile__info}>
					{/* <h2>{name || 'Неизвестно'}</h2>
					<p>Должность: {position || 'Не указано'}</p>
					<p>Отдел: {department || 'Не указан'}</p> */}
					<EmployeeItem
						// key={employee.employee_id}
						employee={employeeInItem}
					/>
				</div>
				<ul className={styles.profile__earnings}>
					<li>
						<div className={styles.earnings__inner}>
							<span>{formatCurrency(totalEarnings || 0)} ₽</span>
							<p>Всего заработано:</p>
						</div>
						<CoinIcon />
					</li>
					<li>
						<div className={styles.earnings__inner}>
							<span>{formatCurrency(pendingEarnings || 0)} ₽</span>
							<p>К получению:</p>
						</div>
						<WalletIcon />
					</li>
					<li>
						<div className={styles.earnings__inner}>
							<span>{formatCurrency(monthlyEarnings || 0)} ₽</span>
							<p>Получено за месяц:</p>
						</div>
						<MonthIcon />
					</li>
					<li>
						<div className={styles.earnings__inner}>
							<span>{hoursWorked || 0} часов</span>
							<p>Отработано:</p>
						</div>
						<HoursIcon />
					</li>
					<li>
						<div className={styles.earnings__inner}>
							<span>{formatCurrency(0)} ₽</span>
							<p>Получено бонусов:</p>
						</div>
						<BonusIcon />
					</li>
					<li>
						<div className={styles.earnings__inner}>
							<span>{formatCurrency(0)} ₽</span>
							<p>Бонусы к получению:</p>
						</div>
						<BonusIcon />
					</li>
				</ul>

				{/* Отображение проектов с использованием Tabs */}
				{projects && projects.length > 0 ? (
					<div className={styles.profile__projects}>
						<h3>Проекты:</h3>

						{/* Компонент Tabs для фильтрации */}
						<Tabs
							tabs={projectStatuses}
							activeTab={activeStatus}
							onTabChange={setActiveStatus}
						/>

						{/* Список проектов, отфильтрованный по активному статусу */}
						<ul className={styles.projectsList}>
							{filteredProjects.map((project) => (
								<li key={project.project_id} className={styles.projectCard}>
									<Link href={`/dashboard/projects/${project.project_id}`}>
										<h4>{project.name}</h4>
										{/* <p>{project.status}</p> */}
									</Link>
								</li>
							))}
						</ul>
					</div>
				) : (
					<p>Сотрудник не назначен на проекты</p>
				)}

			<div>Почасовая ставка: {hourlyRate}</div>
			{/* <Link href={`/dashboard/tasks/employee/${employee_id}`}>Задачи</Link> */}
			{/* <button onClick={() => dispatch(logout())}>Выйти</button> */}
			{viewEmployeeId && (
				<>
					<button
						onClick={() => setModalOpen(true)}
						className={'btn'}
					>
						Заплатить сотруднику
					</button>
					<button onClick={() => setChangeRateModalOpen(true)} className={'btn'}>Сменить почасовую ставку</button>

					<PaymentEmployeeModal
						isOpen={isModalOpen}
						onClose={() => setModalOpen(false)}
						pendingEarnings={pendingEarnings}
						totalEarnings={totalEarnings}
						employeeId={employee_id}
					/>

<ChangeHourlyRateModal
                        isOpen={isChangeRateModalOpen}
                        onClose={() => setChangeRateModalOpen(false)}
                        employeeId={employee_id}
                    />
				</>
			)}
		</div>
	);
};

export default ProfilePage;
