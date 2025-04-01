import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/redux/store';
import { IClient, IContactDetails } from './types';
import { apiClient } from '@/libs/utils/apiClient';
import { getErrorMessage } from '@/libs/utils/getErrorMessage';

export const fetchClients = createAsyncThunk<
	IClient[],
	void,
	{ dispatch: AppDispatch; state: RootState }
>(
	'clients/fetchClients',
	async (_, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get('/clients');
			return data;
		} catch (error) {
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const fetchClientById = createAsyncThunk<
	IClient,
	number,
	{ dispatch: AppDispatch; state: RootState }
>(
	'clients/fetchClientById',
	async (id, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.get(`/clients/${id}`);
			return data;
		} catch (error) {
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const createClient = createAsyncThunk<
	IClient,
	IClient,
	{ dispatch: AppDispatch; state: RootState }
>(
	'clients/createClient',
	async (newClient, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.post('/clients', newClient);
			return data;
		} catch (error) {
			return rejectWithValue(getErrorMessage(error));
		}
	}
);

export const createContactDetails = createAsyncThunk<
	IContactDetails,
	IContactDetails,
	{ state: RootState; dispatch: AppDispatch }
>(
	'clients/createContactDetails',
	async (createContactDetailsDto, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.post(
				'/contact-details',
				createContactDetailsDto
			);
			return data; // Возвращаем созданный контакт
		} catch (error) {
			return rejectWithValue({ message: getErrorMessage(error) });
		}
	}
);
