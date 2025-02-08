import styles from './LoadingSpinner.module.scss';

const LoadingSpinner: React.FC = () => (
	<div className={styles.spinner}>
		<div className={styles.spinner__circle} />
		<div className={styles.spinner__text}>Идёт загрузка</div>
	</div>
);

export default LoadingSpinner;
