import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
	name: "messages",
	initialState: messagesAdapter.getInitialState(),
	reducers: {
		setMessage: messagesAdapter.addOne,
		setMessages: messagesAdapter.addMany,
		messageRemoved: messagesAdapter.removeOne,
		messagesRemoved: messagesAdapter.removeMany,
	},
});

export const { setMessage, setMessages, messageRemoved, messagesRemoved } =
	messagesSlice.actions;
export default messagesSlice.reducer;

export const selectMessages = (state) => state.messages;
