import styles from '../TaskModal.module.scss';

const AssigneeSelector: React.FC<{
	value: string;
	onChange: (val: string) => void;
}> = ({ value, onChange }) => (
	<div className={styles.field}>
		<label htmlFor="projectId">Assigned To</label>
		<input
			type="text"
			id="projectId"
			value={value || ''}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter project ID"
		/>
	</div>
);

export default AssigneeSelector;
