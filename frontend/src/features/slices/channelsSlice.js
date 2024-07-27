import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
	name: "channels",
	initialState: channelsAdapter.getInitialState(),
	reducers: {
		channelsAdded: channelsAdapter.addMany,
	},
});

export const { channelsAdded } = channelsSlice.actions;
export default channelsSlice.reducer;
