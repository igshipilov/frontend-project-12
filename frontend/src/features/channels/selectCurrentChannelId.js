import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const selectCurrentChannelId = createSlice({
	name: "selectCurrentChannelId",
	initialState: 1,
	reducers: {
		selectChannelById: (state, action) => action.payload,
	},
});

export const { selectChannelById } = selectCurrentChannelId.actions;
export default selectCurrentChannelId.reducer;
