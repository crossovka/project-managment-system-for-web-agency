import styles from './Form.module.scss';

export interface BaseFormProps {
	onSubmit: (data: any) => void;
	onClose: () => void;
	children: React.ReactNode;
}

export const BaseForm: React.FC<BaseFormProps> = ({
	onSubmit,
	onClose,
	children,
}) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(e);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.formContent}>{children}</div>
			<div className={styles.formActions}>
				{/* <button type="button" onClick={onClose} className={styles.cancelButton}>
					Отменить
				</button> */}
				<button type="submit" className={styles.submitButton}>
					Сохранить
				</button>
			</div>
		</form>
	);
};
