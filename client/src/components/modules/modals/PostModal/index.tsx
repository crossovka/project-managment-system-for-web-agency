'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
	createPost,
	fetchPostById,
	updatePost,
} from '@/redux/slices/posts/asyncActions';
import { selectCurrentUser } from '@/redux/slices/auth/selectors';

import BaseModal from '@/components/elements/Modal';
import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';
import EditorField from '@/components/elements/Form/EditorField';
import CategoriesDropdown from '@/components/elements/Form/CategoriesDropdown';

import { IPost } from '@/redux/slices/posts/types';

interface PostModalProps {
	isOpen: boolean;
	onClose: () => void;
	post?: IPost; // Если передан, то режим редактирования
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, post }) => {
	const dispatch = useAppDispatch();

	const currentUser = useAppSelector(selectCurrentUser);
	const createdBy = currentUser?.employee?.employee_id;
	const isEditMode = !!post?.post_id;

	// Состояние формы
	const [title, setTitle] = useState<string>(post?.title || '');
	const [description, setDescription] = useState<string>(post?.content || '');
	const [categoryId, setCategoryId] = useState<number>(
		post?.category?.category_id || 0
	);

	// Если режим редактирования и post не загружен, загружаем его
	useEffect(() => {
		if (isEditMode && post && !post.title) {
			dispatch(fetchPostById(post.post_id));
		}
	}, [dispatch, isEditMode, post]);

	// Обновляем состояние, если post изменяется
	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setDescription(post.content || '');
			setCategoryId(post.category?.category_id || 0);
		}
	}, [post]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Проверяем, заполнены ли необходимые поля
		if (!title || !categoryId || isNaN(Number(categoryId))) {
			toast.error('Пожалуйста, заполните все поля');
			return;
		}

		if (!createdBy) {
			toast.error('Ошибка: пользователь не определен');
			return;
		}

		// Формируем объект для нового или обновленного поста
		const newPost: IPost = {
			post_id: post ? post.post_id : 0, // Если редактируем, используем существующий post_id, иначе 0
			title,
			content: description,
			category_id: Number(categoryId),
			createdBy: createdBy || null,
			createdAt: post ? post.createdAt : new Date(),
			updatedAt: new Date(),
		};

		try {
			if (isEditMode) {
				await dispatch(updatePost(newPost)); // Убрали resultAction
				dispatch(fetchPostById(newPost.post_id));
				toast.success('Статья успешно обновлена');
			} else {
				await dispatch(createPost(newPost)); // Убрали resultAction
				toast.success('Статья успешно создана');
			}

			onClose();
		} catch {
			toast.error('Ошибка при сохранении статьи');
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title={
				post ? `Редактировать статью ${post.title}` : 'Создать новую статью'
			}
			size="lg"
		>
			<BaseForm onSubmit={handleSubmit} onClose={onClose}>
				<FormField
					label="Название"
					name="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<CategoriesDropdown
					selectedCategoryId={categoryId}
					onChange={(id) => setCategoryId(id)}
				/>
				<EditorField
					label="Контент"
					value={description}
					onChange={setDescription}
					placeholder="Введите контент статьи..."
				/>
			</BaseForm>
		</BaseModal>
	);
};

export default PostModal;
