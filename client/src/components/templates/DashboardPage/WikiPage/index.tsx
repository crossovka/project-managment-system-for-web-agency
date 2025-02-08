'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectPostError,
	selectPostLoading,
	selectPosts,
} from '@/redux/slices/posts/selectors';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import {
	selectCategories,
	selectCategoryError,
	selectCategoryLoading,
} from '@/redux/slices/categories/selectors';
import { fetchPosts } from '@/redux/slices/posts/asyncActions';
import { fetchCategories } from '@/redux/slices/categories/asyncActions';

import SearchInput from '@/components/elements/SearchInput';
import Tabs from '@/components/elements/Tabs';
import PostList from './PostList';
import PostModal from '@/components/modules/modals/PostModal';
import CategoryModal from '@/components/modules/modals/CategoryModal';

import styles from './WikiPage.module.scss';
import LoadingSpinner from '@/components/elements/LoadingSpinner';

const WikiPage = () => {
	const dispatch = useAppDispatch();

	// Состояние для постов
	const posts = useAppSelector(selectPosts);
	const postLoading = useAppSelector(selectPostLoading);
	const postError = useAppSelector(selectPostError);

	// Состояние для категорий
	const categories = useAppSelector(selectCategories);
	const categoryLoading = useAppSelector(selectCategoryLoading);
	const categoryError = useAppSelector(selectCategoryError);

	// Текущий пользователь для условного рендера
	const currentUser = useAppSelector(selectCurrentUser);

	const [isModalOpen, setModalOpen] = useState(false);
	const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>(''); // Для строки поиска
	const [activeTab, setActiveTab] = useState<string>('Все категории'); // Для табов

	// Фильтрация постов по категории, строке поиска и авторству
	const filteredPosts =
		posts?.filter((post) => {
			const hasValidTitle = post?.title && typeof post.title === 'string';
			const hasValidCategory =
				post?.category && typeof post.category.name === 'string';

			if (!hasValidTitle || !hasValidCategory) {
				return false; // Исключаем некорректные объекты
			}

			// Проверяем соответствие активной вкладке
			const matchesCategory =
				activeTab === 'Все категории' ||
				(activeTab === 'Мои статьи' &&
					post.createdBy?.employee_id === currentUser?.employee.employee_id) ||
				post.category.name === activeTab;

			// Проверяем соответствие строке поиска
			const matchesSearch = post.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			return matchesCategory && matchesSearch;
		}) || [];

	// Уникальные категории постов
	const postCategories = useMemo(() => {

		if (categories && categories.length > 0) {
			// Получаем уникальные категории
			const uniqueCategories = [
				...new Set(
					categories.map((category) => category?.name).filter(Boolean)
				),
			];
			return ['Все категории', 'Мои статьи', ...uniqueCategories];
		}
	
		// Если категорий нет, возвращаем дефолтные вкладки
		console.log('No categories found, returning default tabs.');
		return ['Все категории', 'Мои статьи'];
	}, [categories]);

	useEffect(() => {
		dispatch(fetchCategories());
		dispatch(fetchPosts());
	}, [dispatch]);

	if (postLoading || categoryLoading) {
		return <LoadingSpinner />;
	}

	if (postError) {
		return <p className={styles.error}>Error loading posts: {postError}</p>;
	}

	if (categoryError) {
		return (
			<p className={styles.error}>Error loading categories: {categoryError}</p>
		);
	}

	return (
		<>
			<div className={styles.header}>
				<h1>База знаний компании</h1>
				{/* {isDirector(currentUser) && ( */}
				<button onClick={() => setModalOpen(true)} className={'add-new-btn'}>
					<span>+</span>
				</button>
				{/* )} */}
			</div>
			<SearchInput
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder="Искать статьи..."
			/>
			<div className={styles.tabs}>
				<Tabs
					tabs={postCategories}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
				<button
					onClick={() => setCategoryModalOpen(true)}
					className={'add-new-btn'}
				>
					<span>+</span>
				</button>
			</div>
			<PostList posts={filteredPosts} />
			<PostModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
			<CategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => setCategoryModalOpen(false)}
			/>
		</>
	);
};

export default WikiPage;
