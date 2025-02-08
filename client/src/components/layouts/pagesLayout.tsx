'use client';

import { Next13ProgressBar } from 'next13-progressbar';
import { Toaster } from 'react-hot-toast';

import ReduxProvider from "./ReduxProvider";

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ReduxProvider>
			<html lang="ru">
				<body className="body">
					<Next13ProgressBar height="4px" color="#9466FF" showOnShallow />
					<div className="wrapper">{children}</div>
					{/* !reverseOrder means уведомления будут появляться снизу. */}
					<Toaster position="top-center" reverseOrder={false} />
				</body>
			</html>
		</ReduxProvider>
	);
};

export default PagesLayout;
