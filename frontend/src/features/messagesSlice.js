import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
	name: "messages",
	initialState: messagesAdapter.getInitialState(),
	reducers: {
		channelAdded: messagesAdapter.addOne,
	},
});

export const { messageAdded } = messagesSlice.actions;
export default messagesSlice.reducer;
