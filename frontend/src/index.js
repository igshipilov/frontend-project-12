import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./app/store.js";

import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL =
// 	process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

// export const socket = io(URL);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
