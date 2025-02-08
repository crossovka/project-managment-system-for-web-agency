import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectEmployeeError,
	selectEmployeeLoading,
	selectEmployees,
} from '@/redux/slices/employee/selectors';
import {
	fetchEmployees,
	fetchProjectManagers,
	fetchProjectEmployees,
} from '@/redux/slices/employee/asyncActions';

import EmployeeItem from '../../EmployeeItem';
import { groupEmployeesByDepartment } from '@/libs/utils/employeeHelpers';

import styles from './EmployeeDropdown.module.scss';

interface EmployeeDropdownProps {
	selectedEmployeeId?: number;
	onChange: (employeeId: number | null) => void;
	mode: 'all' | 'managers' | 'project'; // Все сотрудники | Только проектные менеджеры | Сотрудники по проекту |
	projectId?: number;
	title?: string;
}

const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({
	selectedEmployeeId,
	onChange,
	mode,
	projectId,
	title,
}) => {
	const dispatch = useAppDispatch();
	const employees = useAppSelector(selectEmployees);
	const loading = useAppSelector(selectEmployeeLoading);
	const error = useAppSelector(selectEmployeeError);

	const [searchQuery, setSearchQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		console.log('Current mode:', mode);
		console.log('Current projectId:', projectId);
		switch (mode) {
			case 'all':
				dispatch(fetchEmployees());
				break;
			case 'managers':
				console.log('work');
				dispatch(fetchProjectManagers());
				break;
			case 'project':
				if (projectId) {
					console.log(
						'Dispatching fetchProjectEmployees with projectId:',
						projectId
					);
					dispatch(fetchProjectEmployees({ projectId })); // Передаем projectId
				}
				break;
			default:
				console.error('Неизвестный режим работы компонента');
		}
	}, [dispatch, mode, projectId]);

	// Группировка сотрудников по отделам
	const departmentGroups = groupEmployeesByDepartment(employees);

	// Фильтрация сотрудников по поисковому запросу
	const filteredEmployees = Object.entries(departmentGroups).map(
		([department, departmentEmployees]) => ({
			department,
			employees: departmentEmployees.filter((employee) =>
				employee.name.toLowerCase().includes(searchQuery.toLowerCase())
			),
		})
	);

	const handleSelectEmployee = (employeeId: number) => {
		onChange(employeeId);
		setIsDropdownOpen(false);
	};

	const handleClearSelection = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(null);
	};

	const selectedEmployee = employees.find(
		(employee) => employee.employee_id === selectedEmployeeId
	);

	return (
		<div className={styles.dropdown}>
			<div
				className={styles.selectedEmployee}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{selectedEmployee ? (
					<div className={styles.selectedEmployeeDetails}>
						<EmployeeItem employee={selectedEmployee} />
						<button
							className={styles.clearSelection}
							onClick={handleClearSelection}
						>
							×
						</button>
					</div>
				) : (
					<span>{title ? title : 'выберирите сотрудника'}</span>
				)}
			</div>

			{isDropdownOpen && (
				<div className={styles.dropdownList}>
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Поиск..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					{loading && <div className={styles.loading}>Загрузка...</div>}

					{error && !loading && (
						<div className={styles.error}>Ошибка загрузки сотрудников</div>
					)}

					{!loading && filteredEmployees.length === 0 && (
						<div className={styles.noResults}>Нет сотрудников</div>
					)}

					{/* Отображение сотрудников по отделам */}
					{!loading &&
						filteredEmployees.map(
							({ department, employees }) =>
								employees.length > 0 && (
									<div key={department} className={styles.departmentSection}>
										<div className={styles.departmentHeader}>
											<h3>{department}</h3>
										</div>
										{employees.map((employee) => (
											<div
												key={employee.employee_id}
												className={styles.employeeItem}
												onClick={() =>
													handleSelectEmployee(employee.employee_id)
												}
											>
												<EmployeeItem employee={employee} />
											</div>
										))}
									</div>
								)
						)}
				</div>
			)}
		</div>
	);
};

export default EmployeeDropdown;
