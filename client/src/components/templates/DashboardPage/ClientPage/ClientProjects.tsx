import React from 'react';
import Link from 'next/link';


import { IProject } from '@/redux/slices/project/types';

import styles from './ClientPage.module.scss';

interface ClientProjectsProps {
	projects: IProject[];
}

const ClientProjects: React.FC<ClientProjectsProps> = ({ projects }) => {
	return (
		<div className={styles.projects}>
			{projects.map((project) => (
				<Link key={project.project_id} href={`/dashboard/projects/${project.project_id}`} className={styles.projects__item}>
					<h3>{project.name}</h3>
					{/* <p>Status: {project.status}</p> */}
					<p>{project.status}</p>
				</Link>
			))}
		</div>
	);
};

export default ClientProjects;
