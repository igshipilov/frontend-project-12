import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const getCurrentChannelId = createSlice({
	name: "getCurrentChannelId",
	initialState: 1,
	reducers: {
		getChannelById: (state, action) => action.payload,
	},
});

export const { getChannelById } = getCurrentChannelId.actions;
export default getCurrentChannelId.reducer;

export const selectCurrentChannelId = (state) => state.getCurrentChannelId;
