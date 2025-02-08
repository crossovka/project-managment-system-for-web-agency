// client/src/components/layouts/AuthLayout.tsx
'use client';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="auth-layout">
			{children}
		</div>
	);
};

export default AuthLayout;
