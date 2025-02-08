'use client';

import { configureStore } from '@reduxjs/toolkit';
import {
	useDispatch,
	TypedUseSelectorHook,
	useSelector,
	useStore,
} from 'react-redux';

import theme from './slices/theme/slice';
import auth from './slices/auth/slice';
import project from './slices/project/slice';
import tasks from './slices/tasks/slice';
import employee from './slices/employee/slice';
import clients from './slices/clients/slice';
import access from './slices/access/slice';
import post from './slices/posts/slice';
import category from './slices/categories/slice';

export const store = configureStore({
	reducer: {
		theme,
		auth,
		project,
		tasks,
		employee,
		clients,
		access,
		post,
		category
	},
});
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированный useDispatch для dispatch'а действий
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Типизированный useSelector для выбора данных из хранилища
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// Типизированный useStore для хранилища
export const useAppStore = useStore.withTypes<AppStore>();

// console.log('store', store);
// console.log('store.getState', store.getState());
// console.log('store.dispatch', store.dispatch);
