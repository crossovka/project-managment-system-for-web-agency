const HourlyFields: React.FC<{
	hours: string;
	minutes: string;
	cost: string | number;
	onHoursChange: (val: string) => void;
	onMinutesChange: (val: string) => void;
}> = ({ hours, minutes, cost, onHoursChange, onMinutesChange }) => (
	<>
		<label htmlFor="hours">Часы работы</label>
		<input
			id="hours"
			type="text"
			value={hours}
			onChange={(e) => onHoursChange(e.target.value.replace(/\D/, ''))}
			placeholder="0"
		/>
		<label htmlFor="minutes">Минуты работы</label>
		<input
			id="minutes"
			type="text"
			value={minutes}
			onChange={(e) => onMinutesChange(e.target.value.replace(/\D/, ''))}
			placeholder="0"
		/>
		<label>Стоимость</label>
		<p>{cost} рублей</p>
	</>
);

export default HourlyFields;
