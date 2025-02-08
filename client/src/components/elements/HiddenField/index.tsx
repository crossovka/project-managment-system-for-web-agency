import { useState } from 'react';
import toast from 'react-hot-toast';

import styles from './HiddenField.module.scss';

type HiddenFieldProps = {
	label: string;
	value: string;
	initialHidden?: boolean;
};

const HiddenField = ({
	label,
	value,
	initialHidden = false,
}: HiddenFieldProps) => {
	const [isVisible, setIsVisible] = useState(!initialHidden);

	const handleClick = () => {
		navigator.clipboard.writeText(value);
		setIsVisible(true);
		toast.success(`${label} скопирован в буфер обмена`);
	};

	return (
		<div className={styles.hiddenField}>
			<p
				className={styles.copyable}
				onClick={handleClick}
				title="Нажмите, чтобы скопировать и показать"
			>
				{label}: {isVisible ? value : '••••••••'}
			</p>
		</div>
	);
};

export default HiddenField;
