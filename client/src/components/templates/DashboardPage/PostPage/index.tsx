'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	selectCurrentPost,
	selectPostError,
	selectPostLoading,
} from '@/redux/slices/posts/selectors';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import { fetchPostById } from '@/redux/slices/posts/asyncActions';

import { isDirector } from '@/libs/utils/isManagerOrDirector';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import PostModal from '@/components/modules/modals/PostModal';

import styles from './PostPage.module.scss';

interface PostPageProps {
	postId: number;
}

const PostPage: React.FC<PostPageProps> = ({ postId }) => {
	const dispatch = useAppDispatch();
	const post = useAppSelector(selectCurrentPost);
	const loading = useAppSelector(selectPostLoading);
	const error = useAppSelector(selectPostError);

	const currentUser = useAppSelector(selectCurrentUser);
	
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	
	useEffect(() => {
		if (postId) {
			dispatch(fetchPostById(postId));
		}
	}, [dispatch, postId]);
	
	if (loading) {
		return <LoadingSpinner />;
	}
	
	if (error) {
		return <p className={styles.error}>Error loading post: {error}</p>;
	}
	
	if (!post) {
		return <p className={styles.error}>Post not found</p>;
	}
	
	const { title, content, category, createdBy, createdAt, updatedAt } = post;
	console.log('currentUser:', currentUser.employee.employee_id);
  console.log('createdBy:', post.createdBy.employee_id);
  console.log('isDirector(currentUser):', isDirector(currentUser));
	const canEditPost = currentUser && (
		post.createdBy.employee_id === currentUser.employee.employee_id ||
		isDirector(currentUser)
	);
  console.log('canEditPost:', canEditPost);

	return (
		<>
			<div className={styles.header}>
				<h1>{title}</h1>
				{/* {isDirector(currentUser) && ( */}
				{canEditPost && (
					<button
						onClick={() => setEditModalOpen(true)}
						// className={styles.editButton}
						className={'btn'}
					>
						Редактировать статью
					</button>
				)}
				{/* )} */}
				
			</div>
			<Link href="/dashboard/wiki" className={`${styles.backButton} btn`}>
				{/* ← */}
				Вернуться к статьям
			</Link>
			<div className={styles.details}>
				<p>
					<strong>Категория:</strong> {category.name}
				</p>
				<p>
					<strong>Автор:</strong> {createdBy.name}
				</p>
				<p>
					<strong>Создано:</strong>{' '}
					{new Date(createdAt).toLocaleDateString()}
				</p>
				<p>
					<strong>Отредактировано:</strong>{' '}
					{new Date(updatedAt).toLocaleDateString()}
				</p>
			</div>
			
			{/* <h2>Содержание статьи</h2> */}
			<div
				className={`${styles.content} content-field`}
				dangerouslySetInnerHTML={{
					__html: content || '<p>Контент отсутствует</p>',
				}}
			/>
			{/* Модальное окно для редактирования поста */}
			<PostModal
				isOpen={isEditModalOpen}
				onClose={() => setEditModalOpen(false)}
				post={post}
			/>
		</>
	);
};

export default PostPage;
