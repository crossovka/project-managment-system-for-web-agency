export const getWindowWidth = () => {
	const { innerWidth: windowWidth } =
		typeof window !== 'undefined' ? window : { innerWidth: 0 };

	return { windowWidth };
};

export const formatCurrency = (amount: number): string => {
	return amount.toLocaleString('ru-RU'); // Форматирование чисел с разделением тысяч
};
