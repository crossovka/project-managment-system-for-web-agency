import Image from 'next/image';

import { IEmployee } from '@/redux/slices/auth/types';
import { departmentColors, departmentIcons } from '@/constants/department';

import styles from './EmployeeItem.module.scss';

interface EmployeeItemProps {
	employee: IEmployee;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({ employee }) => {
	return (
		<div
			key={employee.employee_id}
			className={styles.employee}
			style={
				{
					'--department-color': departmentColors[employee.department],
				} as React.CSSProperties
			}
		>
			<Image
				src={departmentIcons[employee.department]}
				alt={`${employee.department} icon`}
				width={24}
				height={24}
			/>
			<span>
				{employee.name} — {employee.position} ({employee.department})
			</span>
		</div>
	);
};

export default EmployeeItem;
