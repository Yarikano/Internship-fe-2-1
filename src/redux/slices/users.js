import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	users: [],
	isLoading: false
};

const fetchUsers = createSlice({
	name: 'fetchUsers',
	initialState,
	reducers: {
		getUsersFetch: state => {
			state.isLoading = true;
		},
		getUsersSuccess: (state, action) => {
			state.users = action.payload;
			state.isLoading = false;
		},
		getUsersFailture: state => {
			state.isLoading = false;
		}
	}
});

export const { getUsersFetch, getUsersSuccess, getUsersFailture } =
	fetchUsers.actions;
export default fetchUsers.reducer;
