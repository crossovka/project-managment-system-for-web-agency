import LoginForm from '@/app/login/LoginForm';

import styles from './LoginPage.module.scss'

export default function LoginPage() {
	return (
		<div className={styles.page}>
		<div className={`__container ${styles.container}`}>
			{/* <h1>Login</h1> */}
			<LoginForm />
			{/* <Link href={'/dashboard/'}>дашборд</Link> */}
		</div>
			{/* <Link href={'/dashboard/profile'}>дашборд профиль</Link>  */}
		</div>
	);
}
