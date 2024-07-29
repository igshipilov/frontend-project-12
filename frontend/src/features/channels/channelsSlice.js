import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
	name: "channels",
	initialState: channelsAdapter.getInitialState(),
	reducers: {
		channelAdded: channelsAdapter.addOne,
	},
});

export const { channelAdded } = channelsSlice.actions;
export default channelsSlice.reducer;
