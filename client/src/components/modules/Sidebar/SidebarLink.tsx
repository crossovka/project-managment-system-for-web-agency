import React, { ReactNode } from 'react';
import Link from 'next/link';
// import Image from 'next/image';

const SidebarLink: React.FC<{
	icon: ReactNode;
	href: string;
	title: string;
}> = ({ icon, href, title }) => {
	return (
		<li className="sidebar-links__item">
			<Link href={`/dashboard${href}`}>
				{/* <Image src={`/img/icons/${icon}`} alt="Logo" fill /> */}
				{/* <img src={`/img/icons/${icon}.svg`} /> */}
				<i>{icon}</i>
				<span>{title}</span>
			</Link>
		</li>
	);
};

export default SidebarLink;
