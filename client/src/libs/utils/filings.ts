export const declensionDays = (count: number): string => {
	const titles = ['день', 'дня', 'дней'];
	const remainder = count % 10;
	const remainder100 = count % 100;

	if (remainder === 1 && remainder100 !== 11) {
		return `${count} ${titles[0]}`;
	} else if (
		remainder >= 2 &&
		remainder <= 4 &&
		(remainder100 < 12 || remainder100 > 14)
	) {
		return `${count} ${titles[1]}`;
	} else {
		return `${count} ${titles[2]}`;
	}
};

export const declensionRubles = (count: number): string => {
	const titles = ['рубль', 'рубля', 'рублей'];
	const remainder = count % 10;
	const remainder100 = count % 100;

	if (remainder === 1 && remainder100 !== 11) {
		return `${count} ${titles[0]}`;
	} else if (
		remainder >= 2 &&
		remainder <= 4 &&
		(remainder100 < 12 || remainder100 > 14)
	) {
		return `${count} ${titles[1]}`;
	} else {
		return `${count} ${titles[2]}`;
	}
};
