'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeSliceState, AllowedThemes } from './types';

const initialState: ThemeSliceState = {
	currentTheme: AllowedThemes.LIGHT,
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme(state, action: PayloadAction<AllowedThemes>) {
			state.currentTheme = action.payload;
		},
	},
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
