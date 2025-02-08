import EmployeeItem from '@/components/elements/EmployeeItem';

import { IEmployee } from '@/redux/slices/auth/types';
import styles from './ProjectPage.module.scss';

interface ProjectEmployeesProps {
	employees: IEmployee[];
	showAddEmployeeButton?: boolean;
	openAddEmployeeModal?: () => void;
	title?: string;
}

const ProjectEmployees = ({
	employees,
	showAddEmployeeButton,
	openAddEmployeeModal,
	title,
}: ProjectEmployeesProps) => (
	<div className={styles.employees}>
		{title && showAddEmployeeButton && (
			<div className={styles.employees__heading}>
				{title && <h2 className={styles.sectionTitle}>{title}</h2>}
				{showAddEmployeeButton && openAddEmployeeModal && (
					<button onClick={openAddEmployeeModal} className="add-new-btn">
						<span>+</span>
					</button>
				)}
			</div>
		)}
		<ul>
			{employees.map((employee) => (
				<EmployeeItem key={employee.employee_id} employee={employee} />
			))}
		</ul>
	</div>
);

export default ProjectEmployees;
