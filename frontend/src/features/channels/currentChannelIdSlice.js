import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const currentChannelId = createSlice({
	name: "currentChannelId",
	initialState: 1,
	reducers: {
		setChannelById: (state, action) => action.payload,
	},
});

export const { setChannelById } = currentChannelId.actions;
export default currentChannelId.reducer;

export const selectCurrentChannelId = (state) => state.currentChannelId;
