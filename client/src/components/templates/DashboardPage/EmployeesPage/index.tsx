'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import {
	selectEmployeeError,
	selectEmployeeLoading,
	selectEmployees,
} from '@/redux/slices/employee/selectors';
import { fetchEmployees } from '@/redux/slices/employee/asyncActions';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import EmployeeList from './EmployeeList';
import EmployeeModal from '@/components/modules/modals/EmployeeModal';
import SearchInput from '@/components/elements/SearchInput';
import Tabs from '@/components/elements/Tabs';

import { isDirector } from '@/libs/utils/isManagerOrDirector';

import styles from './EmployeesPage.module.scss';

const EmployeesPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const employees = useAppSelector(selectEmployees);
	const loading = useAppSelector(selectEmployeeLoading);
	const error = useAppSelector(selectEmployeeError);

	const currentUser = useAppSelector(selectCurrentUser);

	const [isModalOpen, setModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>(''); // Для строки поиска
	const [activeStatus, setActiveStatus] = useState<string>('Все отделы'); // Для табов

	// Фильтрация сотрудников по отделу и строке поиска
	const filteredEmployees = employees.filter(
		(employee) =>
			(activeStatus === 'Все отделы' || employee.department === activeStatus) &&
			employee.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Уникальные статусы сотрудников
	const employeeDepartaments = [
		'Все отделы',
		...new Set(employees.map((employee) => employee.department)),
	];

	useEffect(() => {
		dispatch(fetchEmployees());
	}, [dispatch]);

	if (loading) return <LoadingSpinner />;
	if (error) {
		return <p>Ошибка при загрузке списка сотрудников: {error}</p>;
	}

	// const currentUser = useAppSelector(selectEmployee);

	// if (!isManagerOrDirector(currentUser)) {
	// 	return <AccessDenied />;
	// }

	return (
		<div className="">
			<div className={styles.header}>
				<h1 className="">Сотрудники компании</h1>
				{isDirector(currentUser) && (
					<button onClick={() => setModalOpen(true)} className="add-new-btn">
						<span>+</span>
					</button>
				)}
			</div>
			<SearchInput
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder="Поиск сотрудников..."
			/>
			<Tabs
				tabs={employeeDepartaments}
				activeTab={activeStatus}
				onTabChange={setActiveStatus}
			/>
			<EmployeeList employees={filteredEmployees} />
			<EmployeeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
		</div>
	);
};

export default EmployeesPage;
