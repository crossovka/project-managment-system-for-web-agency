import React from 'react';

interface AccessDeniedProps {
	message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
	message = 'У вас недостаточно прав для доступа к этому разделу',
}) => (
	<div className="">
		<div className="">
			<h2 className="">Доступ запрещён!</h2>
			<p className="">{message}</p>
		</div>
	</div>
);

export default AccessDenied;
