import { RootState } from '@/redux/store';

export const selectProject = (state: RootState) => state.project.project;
export const selectProjectLoading = (state: RootState) => state.project.projectLoading;
export const selectProjectError = (state: RootState) => state.project.error;
export const selectEmployeeProjects = (state: RootState) => state.project.employeeProjects
export const selectEmployeeProjectsLoading = (state: RootState) => state.project.employeeProjectsLoading
export const selectProjects = (state: RootState) => state.project.projects;
export const selectProjectsLoading = (state: RootState) => state.project.projectsLoading;
export const selectProjectName = (state: RootState) => state.project.projectName;