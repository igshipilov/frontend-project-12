import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import channelsReducer from "../features/channels/channelsSlice.js";
import messagesReducer from "../features/messages/messagesSlice.js";
import { api } from "../api/api.js";

const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		auth: authReducer,
		channels: channelsReducer,
		messages: messagesReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

export default store;
