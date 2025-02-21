'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarLink: React.FC<{
	icon: ReactNode;
	href: string;
	title: string;
}> = ({ icon, href, title }) => {
	const pathname = usePathname();
	const isActive = pathname === `/dashboard${href}`;

	return (
		<li className={`sidebar-links__item ${isActive ? 'active' : ''}`}>
			<Link href={`/dashboard${href}`} className="sidebar-links__link">
				<i>{icon}</i>
				<span>{title}</span>
			</Link>
		</li>
	);
};

export default SidebarLink;
