import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, IEmployee } from './types';

const initialState: AuthState = {
	employee: null,
	employeeProfile: null,
	token: null,
	loading: false,
	error: null,
	success: false,
	profileLoading: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginStart(state) {
			state.loading = true;
			state.error = null;
			state.success = false; // Сбрасываем success при старте логина
		},
		loginSuccess(
			state,
			action: PayloadAction<{ employee: IEmployee; token: string }>
		) {
			state.employee = action.payload.employee;
			state.token = action.payload.token;
			state.loading = false;
			state.success = true; // Устанавливаем success при успешном логине
			window.location.href = '/dashboard/profile';
		},
		loginFailure(state, action: PayloadAction<string>) {
			state.error = action.payload;
			state.loading = false;
			state.success = false; // Устанавливаем false при ошибке логина
		},
		logout(state) {
			state.currentUser = null;
			state.token = null;
			localStorage.removeItem('token');
			state.success = false; // Сбрасываем success при логауте
			window.location.href = '/login';
		},
	  setCurrentUser(state, action: PayloadAction<IEmployee>) { // Добавлено
			state.currentUser = action.payload;
		},
		setEmployeeProfile(state, action: PayloadAction<IEmployee>) {
				state.employeeProfile = action.payload;
		},
		setProfileLoading(state, action: PayloadAction<boolean>) {
				state.profileLoading = action.payload;
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	setUserProfile,
	setCurrentUser,
	setProfileLoading,
	setEmployeeProfile
} = authSlice.actions;
export default authSlice.reducer;
