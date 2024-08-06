import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const setCurrentChannelId = createSlice({
	name: "setCurrentChannelId",
	initialState: 1,
	reducers: {
		setChannelById: (state, action) => action.payload,
	},
});

export const { setChannelById } = setCurrentChannelId.actions;
export default setCurrentChannelId.reducer;

export const selectCurrentChannelId = (state) => state.setCurrentChannelId;
