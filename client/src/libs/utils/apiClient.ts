import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/slices/auth/slice';
// TODO проверка на то просрочен литокен
/**
 * Axios-инстанс с проверкой токена и автоматической авторизацией.
 */
export const apiClient = (
	dispatch: AppDispatch
	//  getState: () => RootState
) => {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		withCredentials: true,
	});

	instance.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem('token'); // Получаем токен из localStorage

			if (!token) {
				dispatch(logout());
				handleAuthError();
				throw new axios.Cancel('No token available');
			}

			config.headers.Authorization = `Bearer ${token}`;
			return config;
		},
		(error) => Promise.reject(error)
	);

	instance.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.response?.status === 401) {
				dispatch(logout());
				handleAuthError();
			} else {
				toast.error(error.message || 'An error occurred');
			}
			return Promise.reject(error);
		}
	);

	return instance;
};

// function handleAuthError() {
// 	// TODO тоаст еррор не успевает отобразиться
// 	if (typeof window !== 'undefined') {
// 		window.location.href = '/login';
// 	}
// 	toast.error('Please log in to continue');
// }

function handleAuthError() {
	if (typeof window !== 'undefined') {
		const currentPath = window.location.pathname;
		if (currentPath !== '/login') {
			window.location.href = '/login';
		} else {
			toast.error('Please log in to continue');
		}
	}
}
