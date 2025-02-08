import styles from '../TaskModal.module.scss';

const TaskTitleField: React.FC<{
	value: string;
	onChange: (val: string) => void;
}> = ({ value, onChange }) => (
	<div className={styles.field}>
		<label htmlFor="title">Название задачи</label>
		<input
			id="title"
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	</div>
);

export default TaskTitleField;
