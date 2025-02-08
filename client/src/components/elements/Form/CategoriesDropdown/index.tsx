import React, { useState, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectCategories,
	selectCategoryError,
	selectCategoryLoading,
} from '@/redux/slices/categories/selectors';
import { fetchCategories } from '@/redux/slices/categories/asyncActions';

import styles from './CategoriesDropdown.module.scss';

interface CategoriesDropdownProps {
	selectedCategoryId?: number;
	onChange: (categoryId: number | null) => void;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
	selectedCategoryId,
	onChange,
}) => {
	const dispatch = useAppDispatch();
	const categories = useAppSelector(selectCategories);
	const loading = useAppSelector(selectCategoryError);
	const error = useAppSelector(selectCategoryLoading);

	const [searchQuery, setSearchQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!categories.length && !loading) {
			console.log('Fetching categories...');
			dispatch(fetchCategories());
		}
	}, [dispatch, categories.length, loading]);

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSelectCategory = (categoryId: number) => {
		onChange(categoryId);
		setIsDropdownOpen(false);
	};

	const handleClearSelection = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(null);
	};

	const selectedCategory = categories.find(
		(category) => category.category_id === selectedCategoryId
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			window.addEventListener('click', handleClickOutside);
		} else {
			window.removeEventListener('click', handleClickOutside);
		}

		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	}, [isDropdownOpen]);

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<div
				className={styles.selectedCategory}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{selectedCategory ? (
					<div className={styles.selectedCategoryDetails}>
						<h2>{selectedCategory.name}</h2>
						<button
							className={styles.clearSelection}
							onClick={handleClearSelection}
						>
							×
						</button>
					</div>
				) : (
					<span>Выберите категорию</span>
				)}
			</div>

			{isDropdownOpen && (
				<div className={styles.dropdownList}>
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Поиск..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					{loading && <div className={styles.loading}>Загрузка...</div>}

					{error && !loading && (
						<div className={styles.error}>Ошибка загрузки категорий</div>
					)}

					{!loading && filteredCategories.length === 0 && !searchQuery && (
						<div className={styles.noResults}>Нет категорий</div>
					)}

					{!loading && filteredCategories.length === 0 && searchQuery && (
						<div className={styles.noResults}>Не найдено</div>
					)}

					{!loading && filteredCategories.length > 0 && (
						<div className={styles.categoriesList}>
							{filteredCategories.map((category) => (
								<div
									key={category.category_id}
									className={styles.categoryItem}
									onClick={() => handleSelectCategory(category.category_id)}
								>
									<h2>{category.name}</h2>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CategoriesDropdown;
