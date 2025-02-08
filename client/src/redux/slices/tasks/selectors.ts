import { RootState } from '@/redux/store';
import { ITask } from './types';

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectIsTaskModalOpen = (state: RootState) => state.tasks.IsTaskModalOpen;
export const selectCurrentTask = (state: RootState): ITask | null => state.tasks.currentTask;