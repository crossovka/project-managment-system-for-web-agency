import { forwardRef } from 'react';
import styles from './FormField.module.scss';

interface FormFieldProps
	extends React.InputHTMLAttributes<
		HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
	> {
	label: string;
	name: string;
	error?: string;
	type?:
		| 'text'
		| 'email'
		| 'password'
		| 'number'
		| 'date'
		| 'textarea'
		| 'select';
	options?: { value: string | number; label: string }[];
	helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
	(
		{
			label,
			name,
			error,
			type = 'text',
			options,
			helperText,
			className,
			...props
		},
		ref
	) => {
		const renderField = () => {
			switch (type) {
				case 'textarea':
					return (
						<textarea
							id={name}
							name={name}
							className={`${styles.input} ${error ? styles.error : ''} ${
								className || ''
							}`}
							{...props}
						/>
					);

				case 'select':
					return (
						<select
							id={name}
							name={name}
							className={`${styles.select} ${error ? styles.error : ''} ${
								className || ''
							}`}
							{...props}
						>
							<option value="">Select an option</option>
							{options?.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					);

				default:
					return (
						<input
							ref={ref}
							id={name}
							name={name}
							type={type}
							className={`${styles.input} ${error ? styles.error : ''} ${
								className || ''
							}`}
							{...props}
						/>
					);
			}
		};

		return (
			<div className={styles.formGroup}>
				<label htmlFor={name} className={styles.label}>
					{label}
					{props.required && <span className={styles.required}>*</span>}
				</label>
				{renderField()}
				{helperText && <span className={styles.helperText}>{helperText}</span>}
				{error && <span className={styles.errorText}>{error}</span>}
			</div>
		);
	}
);

FormField.displayName = 'FormField';
