import Link from 'next/link';
import EmployeeItem from '@/components/elements/EmployeeItem';

import { IEmployee } from '@/redux/slices/auth/types';
import styles from './EmployeesPage.module.scss';

interface DepartmentSectionProps {
	department: string;
	employees: IEmployee[];
	onEmployeeClick: () => void;
}

const DepartmentSection: React.FC<DepartmentSectionProps> = ({
	department,
	employees,
	onEmployeeClick,
}) => (
	<section className={styles.employeeSection}>
		<h2 className="">{department}</h2>
		<ul className="">
			{employees.map((employee) => (
				<li
					key={employee.employee_id}
					className=""
					onClick={() => onEmployeeClick()}
				>
					<Link
						href={`/dashboard/tasks/assign-to-employee/${employee.employee_id}`}
					>
						Задачи
					</Link>
					<Link href={`/dashboard/profile/${employee.employee_id}`}>
						Профиль
					</Link>
					<EmployeeItem
						// key={employee.employee_id}
						employee={employee}
					/>
				</li>
			))}
		</ul>
	</section>
);

export default DepartmentSection;
