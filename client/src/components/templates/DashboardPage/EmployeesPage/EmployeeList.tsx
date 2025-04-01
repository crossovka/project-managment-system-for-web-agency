import { groupEmployeesByDepartment } from '@/libs/utils/employeeHelpers';

import DepartmentSection from './DepartmentSection';

import { IEmployee } from '@/redux/slices/auth/types';
import { Position } from '@/types/common';
import styles from './EmployeesPage.module.scss';

interface EmployeeListProps {
	employees: IEmployee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
	const handleEmployeeClick = () => {
		// toast.success('редактирование');
	};

	// Исключаем директоров из списка сотрудников
	const filteredEmployees = employees.filter(
		(employee) => employee.position !== Position.DIRECTOR
	);

	const departmentGroups = groupEmployeesByDepartment(filteredEmployees);

	return (
		<div className={styles.departaments}>
			{Object.entries(departmentGroups).map(
				([department, departmentEmployees]) => (
					<DepartmentSection
						key={department}
						department={department}
						employees={departmentEmployees}
						onEmployeeClick={handleEmployeeClick}
					/>
				)
			)}
		</div>
	);
};

export default EmployeeList;
