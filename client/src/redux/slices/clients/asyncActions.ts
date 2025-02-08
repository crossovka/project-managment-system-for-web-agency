import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '@/redux/store';
import { IClient, IContactDetails } from './types';
import { apiClient } from '@/libs/utils/apiClient';

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
			const errorMessage =
				(error as AxiosError)?.response?.data?.message ||
				'Failed to fetch clients';
			return rejectWithValue(errorMessage);
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
			return rejectWithValue(
				(error as AxiosError)?.response?.data?.message ||
					'Failed to fetch client'
			);
		}
	}
);

export const createClient = createAsyncThunk<
	IClient,
	{
		companyName: string;
		contactDetails?: { contactPerson: string; contactInfo: string }[];
	},
	{ dispatch: AppDispatch; state: RootState }
>(
	'clients/createClient',
	async (newClient, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);

		try {
			const { data } = await client.post('/clients', newClient);
			return data;
		} catch (error) {
			return rejectWithValue(
				(error as AxiosError)?.response?.data?.message ||
					'Failed to create client'
			);
		}
	}
);


export const createContactDetails = createAsyncThunk<
	IContactDetails,
	{ state: RootState; dispatch: AppDispatch }
>(
	'clients/createContactDetails',
	async (createContactDetailsDto, { rejectWithValue, dispatch, getState }) => {
		const client = apiClient(dispatch, getState);
		try {
			const { data } = await client.post('/contact-details', createContactDetailsDto);
			return data; // Возвращаем созданный контакт
		} catch (error) {
			return rejectWithValue(
				(error as AxiosError)?.response?.data?.message || 'Failed to create contact details.'
			);
		}
	}
);