import { createSlice } from '@reduxjs/toolkit';
import { fetchClients, fetchClientById, createClient, createContactDetails } from './asyncActions';
import { ClientsState } from './types';

const initialState: ClientsState = {
	clients: [],
	currentClient: null,
	loading: false,
	error: null,
};

const clientsSlice = createSlice({
	name: 'clients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Fetch all clients
		builder
			.addCase(fetchClients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClients.fulfilled, (state, action) => {
				state.loading = false;
				state.clients = action.payload;
			})
			.addCase(fetchClients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Fetch single client
		builder
			.addCase(fetchClientById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClientById.fulfilled, (state, action) => {
				state.loading = false;
				state.currentClient = action.payload;
			})
			.addCase(fetchClientById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		// Create client
		builder
			.addCase(createClient.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createClient.fulfilled, (state, action) => {
				state.loading = false;
				state.clients.push(action.payload); // Добавляем нового клиента в список
			})
			.addCase(createClient.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		builder
			.addCase(createContactDetails.fulfilled, (state, action) => {
				if (state.currentClient) {
					// Обновляем список contactDetails у текущего клиента
					state.currentClient.contactDetails.push(action.payload);
				}
			})
			.addCase(createContactDetails.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});
export const { } = clientsSlice.actions;
export default clientsSlice.reducer;
