import styles from '../TaskModal.module.scss';

const TaskDescriptionField: React.FC<{
	value: string;
	onChange: (val: string) => void;
}> = ({ value, onChange }) => (
	<div className={styles.field}>
		<label htmlFor="description">Описание</label>
		<textarea
			id="description"
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	</div>
);

export default TaskDescriptionField;
