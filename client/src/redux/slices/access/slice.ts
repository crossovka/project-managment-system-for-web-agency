// slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessState, IAccess } from './types';
import {
	// fetchAccessesByProjectId,
	createAccess,
	updateAccess,
	deleteAccess,
} from './asyncActions';

const initialState: AccessState = {
	accesses: [],
	loading: false,
	error: null,
};

const accessSlice = createSlice({
	name: 'access',
	initialState,
	reducers: {
		clearAccesses: (state) => {
			state.accesses = [];
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch accesses
			// .addCase(fetchAccessesByProjectId.pending, (state) => {
			// 	state.loading = true;
			// 	state.error = null;
			// })
			// .addCase(
			// 	fetchAccessesByProjectId.fulfilled,
			// 	(state, action: PayloadAction<IAccess[]>) => {
			// 		state.loading = false;
			// 		state.accesses = action.payload;
			// 	}
			// )
			// .addCase(fetchAccessesByProjectId.rejected, (state, action) => {
			// 	state.loading = false;
			// 	state.error = action.payload as string;
			// })

			// Create access
			.addCase(
				createAccess.fulfilled,
				(state, action: PayloadAction<IAccess>) => {
					state.accesses.push(action.payload);
				}
			)
			.addCase(createAccess.rejected, (state, action) => {
				state.error = action.payload as string;
			})

			// Update access
			.addCase(
				updateAccess.fulfilled,
				(state, action: PayloadAction<IAccess>) => {
					const index = state.accesses.findIndex(
						(access) => access.access_id === action.payload.access_id
					);
					if (index !== -1) {
						state.accesses[index] = action.payload;
					}
				}
			)
			.addCase(updateAccess.rejected, (state, action) => {
				state.error = action.payload as string;
			})

			// Delete access
			.addCase(
				deleteAccess.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.accesses = state.accesses.filter(
						(access) => access.access_id !== action.payload
					);
				}
			)
			.addCase(deleteAccess.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { clearAccesses } = accessSlice.actions;
export default accessSlice.reducer;
