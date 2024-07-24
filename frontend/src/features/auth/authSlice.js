import { createSlice } from "@reduxjs/toolkit";

const AuthState = {
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: AuthState,
	reducers: {
		setCredentials: (state, action) => {
			const { username, token } = action.payload;
			state.user = username;
			state.token = token;
		},
	},
});

// const state = store.getState();

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;