import { RootState } from '@/redux/store';
import { ICategory } from './types';

export const selectCategories = (state: RootState): ICategory[] => state.category.categories;
export const selectCategoryLoading = (state: RootState): boolean => state.category.loading;
export const selectCategoryError = (state: RootState): string | null => state.category.error;
export const selectCurrentCategory = (state: RootState): ICategory | null => state.category.currentCategory;