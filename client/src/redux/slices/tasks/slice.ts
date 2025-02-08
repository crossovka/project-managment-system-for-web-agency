import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	createTask,
	fetchTaskById,
	fetchTasksByEmployeeId,
	fetchTasksByProjectId,
	updateTask,
	updateTaskStatus,
} from './asyncActions';
import { ITask, TasksState } from './types';

const initialState: TasksState = {
	tasks: [],
	loading: false,
	error: null,
	IsTaskModalOpen: false,
	currentTask: null,
};

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		clearTasks: (state) => {
			state.tasks = null;
			state.loading = false;
			state.error = null;
		},
		openTaskModal(state, action: PayloadAction<ITask>) {
			state.IsTaskModalOpen = true;
			state.currentTask = action.payload;
		},
		closeTaskModal(state) {
			state.IsTaskModalOpen = false;
			state.currentTask = null;
		},resetTask(state) {
			state.currentTask = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetching tasks
			.addCase(fetchTasksByEmployeeId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTasksByEmployeeId.fulfilled, (state, action) => {
				state.loading = false;
				state.tasks = action.payload;
			})
			.addCase(fetchTasksByEmployeeId.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		// Fetching tasks by Project ID
		builder
			.addCase(fetchTasksByProjectId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTasksByProjectId.fulfilled, (state, action) => {
				state.loading = false;
				state.tasks = action.payload;
			})
			.addCase(fetchTasksByProjectId.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		// Update Tasks
		builder
			.addCase(updateTask.pending, (state) => {
				state.error = null;
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				if (state.tasks) {
					state.tasks = state.tasks.map((task) =>
						task.task_id === action.payload.task_id
							? {
									...task,
									...action.payload,
									hours: action.payload.hours ?? task.hours,
									minutes: action.payload.minutes ?? task.minutes,
							  }
							: task
					);
				}
			})
			.addCase(updateTask.rejected, (state, action) => {
				state.error = action.payload as string;
			});
		// Create Task
		builder
			.addCase(createTask.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createTask.fulfilled, (state, action) => {
				state.loading = false;
				state.tasks.push(action.payload);
			})
			.addCase(createTask.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		builder
			// Update Task status
			.addCase(updateTaskStatus.fulfilled, (state, action) => {
				if (state.tasks) {
					state.tasks = state.tasks.map((task) =>
						task.task_id === action.payload.task_id ? action.payload : task
					);
				}
			})
			.addCase(updateTaskStatus.rejected, (state, action) => {
				state.error = action.payload as string;
			});
		// Fetch Task by ID
		builder
		.addCase(fetchTaskById.pending, (state) => {
				state.currentTask = null;
				state.loading = true;
				state.error = null;
		})
		.addCase(fetchTaskById.fulfilled, (state, action) => {
				console.log('FetchTaskById fulfilled:', action.payload);
				state.loading = false;
				state.currentTask = action.payload;
		})
		.addCase(fetchTaskById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
		});
	},
});

export const { clearTasks, openTaskModal, closeTaskModal, resetTask } = tasksSlice.actions;
export default tasksSlice.reducer;
