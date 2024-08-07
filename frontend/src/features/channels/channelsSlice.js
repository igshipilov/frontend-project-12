import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
	name: "channels",
	initialState: channelsAdapter.getInitialState(),
	reducers: {
		channelAdded: channelsAdapter.addOne,
		channelsAdded: channelsAdapter.addMany,
		channelRenamed: channelsAdapter.updateOne,
		channelRemoved: channelsAdapter.removeOne,
	},
});

export const { channelAdded, channelsAdded, channelRenamed, channelRemoved } =
	channelsSlice.actions;
export default channelsSlice.reducer;

export const selectChannels = (state) => state.channels;
