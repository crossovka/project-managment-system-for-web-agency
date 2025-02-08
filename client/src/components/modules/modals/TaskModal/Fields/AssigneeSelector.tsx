import styles from '../TaskModal.module.scss';

const AssigneeSelector: React.FC<{
	value: string;
	onChange: (val: string) => void;
}> = ({ value, onChange }) => (
	<div className={styles.field}>
		<label htmlFor="assignedTo">Assigned To</label>
		<input
			type="text"
			id="assignedTo"
			value={value || ''}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter Assignee ID"
		/>
	</div>
);

export default AssigneeSelector;
