import { RootState } from '../../store';

export const selectClients = (state: RootState) => state.clients.clients;
export const selectClientsLoading = (state: RootState) => state.clients.loading;
export const selectClientsError = (state: RootState) => state.clients.error;
export const selectCurrentClient = (state: RootState) => state.clients.currentClient;