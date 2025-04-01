import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { selectToken } from '@/redux/slices/auth/selectors';

const withAuth = <P extends object>(Component: ComponentType<P>) => {
	const AuthenticatedComponent = (props: P) => {
		const token = useAppSelector(selectToken);
		const router = useRouter();

		useEffect(() => {
			if (!token) {
				router.push('/login'); // Redirect to login page
			}
		}, [token, router]);

		return token ? <Component {...props} /> : null;
	};

	return AuthenticatedComponent;
};

export default withAuth;
