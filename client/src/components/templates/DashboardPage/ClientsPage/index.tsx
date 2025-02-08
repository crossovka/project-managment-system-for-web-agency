'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/store';
// import { selectEmployee } from '@/redux/slices/auth/selectors';
import { fetchClients } from '@/redux/slices/clients/asyncActions';
import {
	selectClients,
	selectClientsError,
	selectClientsLoading,
} from '@/redux/slices/clients/selectors';
// import { isManagerOrDirector } from '@/libs/utils/isManagerOrDirector';

import LoadingSpinner from '@/components/elements/LoadingSpinner';
import CreateClientModal from '@/components/modules/modals/CreateClientModal';
import SearchInput from '@/components/elements/SearchInput';
// import ClientsList from './ClientsList.tsx';
// import AccessDenied from '@/components/elements/AccessDenied/AccessDenied';

import { selectCurrentUser } from '@/redux/slices/auth/selectors';
import { isDirector } from '@/libs/utils/isManagerOrDirector';

import styles from './ClientsPage.module.scss';

const ClientsPage: React.FC = () => {
	const dispatch = useAppDispatch();

	const clients = useAppSelector(selectClients);
	const loading = useAppSelector(selectClientsLoading);
	const error = useAppSelector(selectClientsError);

	const currentUser = useAppSelector(selectCurrentUser);

	const [isModalOpen, setModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>(''); // Поисковый запрос

	// Фильтрация клиентов по поисковому запросу
	const filteredClients = clients.filter((client) =>
		client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// const currentUser = useAppSelector(selectEmployee);

	// if (!isManagerOrDirector(currentUser)) {
	// 	return <AccessDenied />;
	// }

	useEffect(() => {
		dispatch(fetchClients());
	}, [dispatch]);

	if (loading) return <LoadingSpinner />;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<div className={styles.header}>
				<h1>Клиенты компании</h1>
				{isDirector(currentUser) && (
					<button onClick={() => setModalOpen(true)} className="add-new-btn">
						<span>+</span>
					</button>
				)}
			</div>
			{/* Поле для поиска */}
			<SearchInput
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder="Поиск клиентов..."
			/>
			<ul className={styles.clientsList}>
				{filteredClients.map((client) => (
					<li key={client.client_id}>
						<Link
							href={`/dashboard/clients/${client.client_id}`}
							className={`link ${styles.clientCard}`}
						>
							<h2>{client.companyName}</h2>
						</Link>
					</li>
				))}
			</ul>
			<CreateClientModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</div>
	);
};

export default ClientsPage;
