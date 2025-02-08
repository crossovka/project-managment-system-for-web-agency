import React, { useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectClients, selectClientsError, selectClientsLoading } from '@/redux/slices/clients/selectors';
import { fetchClients } from '@/redux/slices/clients/asyncActions';

import styles from './ClientsDropdown.module.scss';

interface ClientsDropdownProps {
	selectedClientId?: number;
	onChange: (clientId: number | null) => void;
}

const ClientsDropdown: React.FC<ClientsDropdownProps> = ({
	selectedClientId,
	onChange,
}) => {
	const dispatch = useAppDispatch();
	const clients = useAppSelector(selectClients);
	const loading = useAppSelector(selectClientsLoading);
	const error = useAppSelector(selectClientsError);

	const [searchQuery, setSearchQuery] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		console.log('Fetching clients...');
		dispatch(fetchClients());
	}, [dispatch]);

	const filteredClients = clients.filter((client) =>
		client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSelectClient = (clientId: number) => {
		onChange(clientId);
		setIsDropdownOpen(false);
	};

	const handleClearSelection = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(null);
	};

	const selectedClient = clients.find(
		(client) => client.client_id === selectedClientId
	);

	return (
		<div className={styles.dropdown}>
			<div
				className={styles.selectedClient}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{selectedClient ? (
					<div className={styles.selectedClientDetails}>
						<h2>{selectedClient.companyName}</h2>
						<button
							className={styles.clearSelection}
							onClick={handleClearSelection}
						>
							×
						</button>
					</div>
				) : (
					<span>Выберите клиента</span>
				)}
			</div>

			{isDropdownOpen && (
				<div className={styles.dropdownList}>
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Поиск..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					{loading && <div className={styles.loading}>Загрузка...</div>}

					{error && !loading && (
						<div className={styles.error}>Ошибка загрузки клиентов</div>
					)}

					{!loading && filteredClients.length === 0 && (
						<div className={styles.noResults}>Нет клиентов</div>
					)}

					{!loading &&
						filteredClients.length > 0 &&
						filteredClients.map((client) => (
							<div
								key={client.client_id}
								className={styles.clientItem}
								onClick={() => handleSelectClient(client.client_id)}
							>
								<h2>{client.companyName}</h2>
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default ClientsDropdown;
