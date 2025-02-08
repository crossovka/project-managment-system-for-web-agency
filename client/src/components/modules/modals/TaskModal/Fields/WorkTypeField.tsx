import { WorkType } from "@/types/common";
import styles from '../TaskModal.module.scss';

const WorkTypeField: React.FC<{
	value: WorkType;
	onChange: (val: WorkType) => void;
}> = ({ value, onChange }) => (
	<div className={styles.field}>
		<label htmlFor="workType">Тип работы</label>
		<select
			id="workType"
			value={value}
			onChange={(e) => onChange(e.target.value as WorkType)}
		>
			<option value={WorkType.PROJECT_BASED}>Проектная работа</option>
			<option value={WorkType.HOURLY_BASED}>Почасовая</option>
		</select>
	</div>
);

export default WorkTypeField;
