import { createSlice } from '@reduxjs/toolkit';
import {
	addEmployeeToProject,
	addPaymentToProject,
	createProject,
	fetchEmployeeProjects,
	fetchProjectById,
	fetchProjectNameById,
	fetchProjects,
	updateProjectDescription,
	updateProjectImportantInfo,
	updateProjectManager,
} from './asyncActions';
import { ProjectState } from './types';

const initialState: ProjectState = {
	projects: [],
	projectsLoading: false,
	employeeProjects: [],
	employeeProjectsLoading: false,
	project: null,
	projectLoading: false,
	projectName: null,
	loading: false,
	error: null,
};

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		clearProject: (state) => {
			state.project = null;
			state.projectLoading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		// Обработчик для fetchProjects
		builder
			.addCase(fetchProjects.pending, (state) => {
				state.projectsLoading = true;
				state.error = null;
			})
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.projectsLoading = false;
				state.projects = action.payload;
			})
			.addCase(fetchProjects.rejected, (state, action) => {
				state.projectsLoading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(fetchEmployeeProjects.pending, (state) => {
				state.employeeProjectsLoading = true;
				state.error = null;
			})
			.addCase(fetchEmployeeProjects.fulfilled, (state, action) => {
				state.employeeProjectsLoading = false;
				state.employeeProjects = action.payload;
			})
			.addCase(fetchEmployeeProjects.rejected, (state, action) => {
				state.employeeProjectsLoading = false;
				state.error = action.payload as string;
			});
		// Fetch project name by ID
		builder
			.addCase(fetchProjectNameById.pending, (state) => {
				state.projectLoading = true;
				state.error = null;
			})
			.addCase(fetchProjectNameById.fulfilled, (state, action) => {
				state.projectLoading = false;
				state.projectName = action.payload;
			})
			.addCase(fetchProjectNameById.rejected, (state, action) => {
				state.projectLoading = false;
				state.error = action.payload as string;
			});
		// Обработчик для fetchProjectById
		builder
			.addCase(fetchProjectById.pending, (state) => {
				state.projectLoading = true;
				state.error = null;
			})
			.addCase(fetchProjectById.fulfilled, (state, action) => {
				state.projectLoading = false;
				state.project = action.payload;
			})
			.addCase(fetchProjectById.rejected, (state, action) => {
				state.projectLoading = false;
				state.error = action.payload as string;
			});

		// Обработчик для addPaymentToProject
		builder
			.addCase(addPaymentToProject.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addPaymentToProject.fulfilled, (state, action) => {
				state.loading = false;
				// Обновляем проект в состоянии, если он есть
				if (
					state.project &&
					state.project.project_id === action.payload.project_id
				) {
					state.project.accountsReceivable = action.payload.accountsReceivable;
				}
				// Обновляем проект в списке проектов, если он там есть
				state.projects = state.projects.map((project) =>
					project.project_id === action.payload.project_id
						? {
								...project,
								accountsReceivable: action.payload.accountsReceivable,
						  }
						: project
				);
			})
			.addCase(addPaymentToProject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Обработчик для createProject
		builder
			.addCase(createProject.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createProject.fulfilled, (state, action) => {
				state.loading = false;
				state.projects = [...state.projects, action.payload];
			})
			.addCase(createProject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		builder
			.addCase(addEmployeeToProject.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addEmployeeToProject.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(addEmployeeToProject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		builder
			.addCase(updateProjectManager.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateProjectManager.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(updateProjectManager.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		// Обработчик для updateProjectDescription
		builder
			.addCase(updateProjectDescription.fulfilled, (state, action) => {
				if (
					state.project &&
					state.project.project_id === action.payload.project_id
				) {
					state.project.description = action.payload.description;
				}
				// Обновляем проект в списке проектов, если он там есть
				state.projects = state.projects.map((project) =>
					project.project_id === action.payload.project_id
						? { ...project, description: action.payload.description }
						: project
				);
			})
			.addCase(updateProjectDescription.rejected, (state, action) => {
				state.error = action.payload as string;
			});

		// Обработчик для updateProjectImportantInfo
		builder
			.addCase(updateProjectImportantInfo.fulfilled, (state, action) => {
				if (
					state.project &&
					state.project.project_id === action.payload.project_id
				) {
					state.project.importantInfo = action.payload.importantInfo;
				}
				// Обновляем проект в списке проектов, если он там есть
				state.projects = state.projects.map((project) =>
					project.project_id === action.payload.project_id
						? { ...project, importantInfo: action.payload.importantInfo }
						: project
				);
			})
			.addCase(updateProjectImportantInfo.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { clearProject } = projectSlice.actions;

export default projectSlice.reducer;
