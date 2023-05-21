import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	cats: [],
	isLoading: false
};

export const catsFetch = createSlice({
	name: 'cats',
	initialState,
	reducers: {
		getCatsFetch: state => {
			state.isLoading = true;
		},
		getCatsSuccess: (state, action) => {
			state.cats = action.payload;
			state.isLoading = false;
		},
		getCatsFailture: state => {
			state.isLoading = false;
		}
	}
});

export const { getCatsFailture, getCatsFetch, getCatsSuccess } =
	catsFetch.actions;
export default catsFetch.reducer;
