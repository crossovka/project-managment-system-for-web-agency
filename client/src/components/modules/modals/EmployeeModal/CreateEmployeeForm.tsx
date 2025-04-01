import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { useAppDispatch } from '@/redux/store';
import { createEmployee } from '@/redux/slices/employee/asyncActions';

import { BaseForm } from '@/components/elements/Form/BaseForm';
import { FormField } from '@/components/elements/Form/FormField';

import { departmentPositionMap } from '@/libs/utils/employeeHelpers';
import { basePropsForMotion } from '@/constants/motion';
import { Department, Position } from '@/types/common';

interface CreateEmployeeFormProps {
	onClose: () => void;
}

const CreateEmployeeForm: React.FC<CreateEmployeeFormProps> = ({ onClose }) => {
	const dispatch = useAppDispatch();

	const [formState, setFormState] = useState({
		name: '',
		department: '',
		position: '',
		password: '',
		hourlyRate: '',
	});
	const [positions, setPositions] = useState<Position[]>([]);

	useEffect(() => {
		// Update positions based on selected department
		if (formState.department) {
			setPositions(
				departmentPositionMap[formState.department as Department] || []
			);
		} else {
			setPositions([]);
		}
	}, [formState.department]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormState((prev) => ({
			...prev,
			[name]: name === 'hourlyRate' ? Number(value) || '' : value, // Преобразуем в число
			...(name === 'department' && { position: '' }),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Отправка данных:', formState);
		if (
			!formState.name ||
			!formState.department ||
			!formState.position ||
			!formState.password ||
			!formState.hourlyRate
		) {
			toast.error('Заполните все обязательные поля');
			return;
		}
		if (formState.password.length < 6) {
			toast.error('Пароль должен быть не короче 6 символов');
			return;
		}
		try {
			await dispatch(createEmployee(formState)).unwrap();
			toast.success('Сотрудник успешно создан');
			onClose();
		} catch {
			toast.error('ошибка при создании сотрудника');
		}
	};

	return (
		<BaseForm onSubmit={handleSubmit} onClose={onClose}>
			<FormField
				label="Имя"
				name="name"
				value={formState.name}
				onChange={handleChange}
				required
			/>

			<FormField
				label="Пароль"
				name="password"
				type="password"
				value={formState.password}
				onChange={handleChange}
				required
			/>

			<FormField
				label="Почасовая ставка"
				name="hourlyRate"
				type="number"
				value={formState.hourlyRate}
				onChange={handleChange}
				required
			/>

			<FormField
				label="Отдел"
				name="department"
				type="select"
				options={Object.keys(departmentPositionMap).map((departmentKey) => ({
					value: departmentKey,
					label: departmentKey,
				}))}
				value={formState.department}
				onChange={handleChange}
				required
			/>

			{/* Animate position select field */}
			<motion.div
				className={'styles.positionContainer'}
				initial="initial"
				animate={formState.department ? 'animate' : 'initial'}
				exit="exit"
				variants={basePropsForMotion}
			>
				{formState.department && (
					<FormField
						label="Должность"
						name="position"
						type="select"
						options={positions.map((position) => ({
							value: position,
							label: position,
						}))}
						value={formState.position}
						onChange={handleChange}
						required
					/>
				)}
			</motion.div>
		</BaseForm>
	);
};

export default CreateEmployeeForm;
