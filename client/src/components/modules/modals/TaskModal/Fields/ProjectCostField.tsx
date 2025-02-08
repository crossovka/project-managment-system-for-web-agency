const ProjectCostField: React.FC<{
	cost: string | number;
	onCostChange: (val: string) => void;
}> = ({ cost, onCostChange }) => (
	<div>
		<label htmlFor="cost">Стоимость</label>
		<input
			id="cost"
			type="text"
			value={cost === '' ? '' : cost}
			onChange={(e) => onCostChange(e.target.value.replace(/[^0-9.]/g, ''))}
			placeholder="0.00"
		/>
	</div>
);

export default ProjectCostField;
