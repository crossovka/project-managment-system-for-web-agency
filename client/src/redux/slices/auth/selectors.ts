import { RootState } from '@/redux/store';
import { AuthState } from './types';

export const selectAuthState = (state: RootState): AuthState => state.auth;
export const selectCurrentUser = (state: RootState): IEmployee | null => state.auth.currentUser;
export const selectEmployeeProfile = (state: RootState): IEmployee | null => state.auth.employeeProfile;
export const selectToken = (state: RootState): string | null => state.auth.token;
export const selectAuthError = (state: RootState): string | null => state.auth.error;
export const selectAuthLoading = (state: RootState): boolean => state.auth.loading;
export const selectAuthSuccess = (state: RootState): boolean => state.auth.success;
export const selectProfileLoading = (state: RootState): boolean => state.auth.profileLoading;