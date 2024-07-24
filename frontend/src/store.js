import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from "./features/slices/channelsSlice.js";
import messagesReducer from "./features/slices/messagesSlice.js";
import authReducer from "./features/auth/authSlice.js";

import { channelsApi } from "./features/RTKQuery/channelsApi.js";

const store = configureStore({
	reducer: {
        auth: authReducer,
		channels: channelsReducer,
        messages: messagesReducer,
        [channelsApi.reducerPath]: channelsApi.reducer
	},
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(channelsApi.middleware),
});

export default store;
