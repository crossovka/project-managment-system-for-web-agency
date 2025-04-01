import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
	const axiosError = error as AxiosError<{ message?: string }>;
	return (
		axiosError?.response?.data?.message ||
		'Произошла ошибка при выполнении запроса'
	);
};
