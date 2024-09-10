import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const activeChannelId = createSlice({
	name: "activeChannelId",
	initialState: 1,
	reducers: {
		setActiveChannelId: (state, action) => {
			console.group("activeChannelIdSlice.js");
			console.log("actual id:", action.payload);
			console.groupEnd();

			return action.payload;
		},
	},
});

export const { setActiveChannelId } = activeChannelId.actions;
export default activeChannelId.reducer;

export const selectActiveChannelId = (state) => state.activeChannelId;
