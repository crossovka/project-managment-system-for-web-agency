'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { selectToken } from '@/redux/slices/auth/selectors';

const withAuth = (Component: React.ComponentType) => {
	const AuthenticatedComponent = (props: any) => {
		const token = useAppSelector(selectToken);
		const router = useRouter();

		useEffect(() => {
			if (!token) {
				router.push('/login'); // Redirect to login page
			}
		}, [token]);

		return token ? <Component {...props} /> : null;
	};

	return AuthenticatedComponent;
};

export default withAuth;
