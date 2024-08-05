import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
	name: "channels",
	initialState: channelsAdapter.getInitialState(),
	reducers: {
		channelAdded: channelsAdapter.addOne,
		channelsAdded: channelsAdapter.addMany,
	},
});

export const { channelAdded, channelsAdded } = channelsSlice.actions;
export default channelsSlice.reducer;

export const selectChannels = (state) => state.channels;
