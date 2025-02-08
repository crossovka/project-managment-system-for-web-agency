'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchClientById } from '@/redux/slices/clients/asyncActions';
import {
	selectClientsError,
	selectClientsLoading,
	selectCurrentClient,
} from '@/redux/slices/clients/selectors';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import ClientProjects from './ClientProjects';
import ContactDetails from './ContactDetails';

import styles from './ClientPage.module.scss';

interface ClientPageProps {
	id: string;
}

const ClientPage: React.FC<ClientPageProps> = ({ id }) => {
	const dispatch = useAppDispatch();
	const client = useAppSelector(selectCurrentClient);
	const loading = useAppSelector(selectClientsLoading);
	const error = useAppSelector(selectClientsError);

	useEffect(() => {
		if (id) {
			dispatch(fetchClientById(+id));
		}
	}, [id, dispatch]);

	if (loading) return <LoadingSpinner />;
	if (error) return <div>Error: {error}</div>;
	if (!client) return <div>Client not found</div>;

	return (
		<div className={styles.clientPage}>
			<div className={styles.header}>
				<h1>{client.companyName}</h1>
			</div>

			<div className={styles.content}>
				<section className={styles.section}>
					<ContactDetails
						contactDetails={client.contactDetails}
						clientId={+client.client_id}
					/>
				</section>

				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2>Проекты</h2>
					</div>
					<ClientProjects projects={client.projects} />
				</section>
			</div>
		</div>
	);
};

export default ClientPage;
