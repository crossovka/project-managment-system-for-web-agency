// src/categories/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from './asyncActions';
import { CategoryState, ICategory } from './types';

const initialState: CategoryState = {
	categories: [],
	loading: false,
	error: null,
	currentCategory: null,
};

// Вспомогательные функции для обработки состояния
const handlePending = (state: CategoryState) => {
	state.loading = true;
	state.error = null;
};

const handleFulfilled = (
	state: CategoryState,
	action: PayloadAction<ICategory[]>
) => {
	state.loading = false;
	state.categories = action.payload;
	state.error = null;
};

const handleRejected = (
	state: CategoryState,
	action: PayloadAction<string | undefined>
) => {
	state.loading = false;
	state.error = action.payload || 'Ошибка выполнения операции';
};

// const handleSingleFulfilled = (
// 	state: CategoryState,
// 	action: PayloadAction<ICategory>
// ) => {
// 	state.loading = false;
// 	state.error = null;
// 	if (action.payload) {
// 		state.currentCategory = action.payload;
// 	}
// };

const handleDeleteFulfilled = (
	state: CategoryState,
	action: PayloadAction<number>
) => {
	state.loading = false;
	state.error = null;
	state.categories = state.categories.filter(
		(category) => category.category_id !== action.payload
	);
};

const handleCreateFulfilled = (
	state: CategoryState,
	action: PayloadAction<ICategory>
) => {
	state.loading = false;
	state.error = null;
	state.categories.push(action.payload);
};

const handleUpdateFulfilled = (
	state: CategoryState,
	action: PayloadAction<ICategory>
) => {
	state.loading = false;
	state.error = null;
	const index = state.categories.findIndex(
		(category) => category.category_id === action.payload.category_id
	);
	if (index !== -1) {
		state.categories[index] = action.payload;
	}
};

// Создаем слайс
const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		setCurrentCategory(state, action: PayloadAction<ICategory | null>) {
			state.currentCategory = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Обработка получения всех категорий
		builder.addCase(fetchCategories.pending, handlePending);
		builder.addCase(fetchCategories.fulfilled, handleFulfilled);
		builder.addCase(fetchCategories.rejected, handleRejected);

		// Обработка создания категории
		builder.addCase(createCategory.pending, handlePending);
		builder.addCase(createCategory.fulfilled, handleCreateFulfilled);
		builder.addCase(createCategory.rejected, handleRejected);

		// Обработка обновления категории
		builder.addCase(updateCategory.pending, handlePending);
		builder.addCase(updateCategory.fulfilled, handleUpdateFulfilled);
		builder.addCase(updateCategory.rejected, handleRejected);

		// Обработка удаления категории
		builder.addCase(deleteCategory.pending, handlePending);
		builder.addCase(deleteCategory.fulfilled, handleDeleteFulfilled);
		builder.addCase(deleteCategory.rejected, handleRejected);
	},
});

export const { setCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
