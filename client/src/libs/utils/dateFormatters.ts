export const formatToISOString = (
	date: Date | string | null | undefined
): string => {
	if (!date) return '';

	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return dateObj instanceof Date && !isNaN(dateObj.getTime())
		? dateObj.toISOString()
		: '';
};

export const formatToLocalDate = (
	date: Date | string | null | undefined
): string => {
	if (!date) return 'Не указано';

	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return dateObj instanceof Date && !isNaN(dateObj.getTime())
		? dateObj.toLocaleDateString()
		: 'Не указано';
};
