import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: {},
	isLoading: false
};
export const localData = createSlice({
	name: 'localData',
	initialState,
	reducers: {
		fetchLocalStorage(state) {
			state.isLoading = true;
		},
		fetchSuccess(state, action) {
			state.user = action.payload;
			state.isLoading = false;
		}
	}
});

export const { fetchLocalStorage, fetchSuccess } = localData.actions;

export default localData.reducer;
