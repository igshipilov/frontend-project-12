import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const selectCurrentChannelId = createSlice({
	name: "selectCurrentChannelId",
	initialState: 1,
	reducers: {
		selectChannel: (state, action) =>
			(state = action.payload.currentChannelId),
	},
});

export const { selectChannel } = selectCurrentChannelId.actions;
export default selectCurrentChannelId.reducer;
