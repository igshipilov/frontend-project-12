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
		logout: (state) => {
			state.user = null;
			state.token = null;
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthenticatedUser= state => state.auth;
