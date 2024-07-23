import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from "./features/channelsSlice.js";
import messagesReducer from "./features/messagesSlice.js";

const store = configureStore({
	reducer: {
		channels: channelsReducer,
        messages: messagesReducer,
	},
});

export default store;

// const initialState = {
//     status: 'idle',
//     entities: {}
//   }

// const usersSlice = createSlice({
// 	name: "users",
// 	initialState,
// 	reducers: {
// 		userAdded(state, action) {
// 			const user = action.payload;
// 			state.entities[user.id] = user;
// 		},
// 	},
// });

// const store = configureStore({
// 	reducer: {
// 		users: usersSlice.reducer,
// 	},
// });

// export const { userAdded } = usersSlice.actions;
// export default store;
