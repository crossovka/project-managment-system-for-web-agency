import { IProject } from '../project/types';

// Типы для клиентов
export interface IClient {
	client_id: number;
	companyName: string;
	contactDetails: IContactDetails[];
	projects: IProject[];
}

export interface IContactDetails {
	id: number;
	contactInfo: string;
	contactPerson: string;
	client_id: number;
}

export interface CreateContactDetailsDto {
	clientId: number; // ID клиента, к которому привязывается контакт
	contactPerson: string; // Имя контакта
	contactInfo: string; // Информация о контакте
}

export interface ClientsState {
	clients: IClient[];
	currentClient: IClient | null;
	loading: boolean;
	error: string | null;
}
