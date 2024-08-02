import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
	name: "messages",
	initialState: messagesAdapter.getInitialState(),
	reducers: {
		setMessage: messagesAdapter.addOne,
        setMessages: messagesAdapter.addMany,
	},
});

export const { setMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
