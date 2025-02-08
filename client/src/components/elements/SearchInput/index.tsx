import React from 'react';
import styles from './SearchInput.module.scss';

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
	value,
	onChange,
	placeholder = 'Поиск...',
}) => {
	return (
		<div className={styles.searchContainer}>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={styles.searchInput}
			/>
		</div>
	);
};

export default SearchInput;
