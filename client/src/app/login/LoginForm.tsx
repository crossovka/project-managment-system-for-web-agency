'use client';

// import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { login } from '@/redux/slices/auth/asyncActions';
import {
	selectAuthError,
	selectAuthLoading,
	// selectAuthSuccess,
} from '@/redux/slices/auth/selectors';

import { FormField } from '@/components/elements/Form/FormField';

import styles from './LoginPage.module.scss';

const LoginForm = () => {
	const [credentials, setCredentials] = useState({ name: '', password: '' });
	const dispatch = useAppDispatch();
	const error = useAppSelector(selectAuthError);
	const loading = useAppSelector(selectAuthLoading);
	// const success = useAppSelector(selectAuthSuccess);
	// const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (credentials.name && credentials.password) {
			await dispatch(login(credentials));
		} else {
			console.log('Please fill in both fields');
		}
	};

	// useEffect(() => {
	// 	// console.log('Success state changed:', success); // Логирование состояния success
	// 	if (success) {
	// 		console.log('Redirecting to dashboard...');
	// 		// window.location.href = '/dashboard';
	// 		// router.push('/dashboard');
	// 	}
	// }, [success, router]);

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<h2>Вход в систему</h2>
			<div className={styles.fields}>
				<FormField
					label="Имя"
					name="name"
					value={credentials.name}
					onChange={handleChange}
					// error={error ? 'Имя пользователя обязательно' : ''}
					required
				/>
				<FormField
					label="Пароль"
					name="password"
					type="password"
					value={credentials.password}
					onChange={handleChange}
					// error={error ? 'Пароль обязателен' : ''}
					required
				/>
			{error && <div className={styles.error}>{error}</div>}
			</div>
			<button type="submit" disabled={loading} className="btn">
				{loading ? 'Входим...' : 'Войти'}
			</button>
		</form>
	);
};

export default LoginForm;
