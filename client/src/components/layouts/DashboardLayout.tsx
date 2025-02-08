'use client';

// import { useAppDispatch, useAppSelector } from '@/redux/store';

import { Sidebar } from '../modules/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	// const dispatch = useAppDispatch();

	return (
		<>
			{/* <NavBar /> */}
			<div className="dashboard">
				<Sidebar />
				<main className="with-sidebar">{children}</main>
				{/* {children} */}
			</div>
			{/* <Footer /> */}
		</>
	);
};

export default DashboardLayout;
