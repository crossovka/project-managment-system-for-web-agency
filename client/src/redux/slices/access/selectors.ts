import { RootState } from '@/redux/store';

export const selectAccesses = (state: RootState) => state.access.accesses;
export const selectAccessLoading = (state: RootState) => state.access.loading;
export const selectAccessError = (state: RootState) => state.access.error;
