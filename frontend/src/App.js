import "bootstrap/dist/css/bootstrap.css";

import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

import { setCredentials, logout } from "./features/auth/authSlice.js";

import store from "./app/store.js";

import "./App.css";

import { BrowserRouter, Link, Navigate, Routes, Route } from "react-router-dom";

import { useSelector } from "react-redux";
import Auth from "./components/Auth.js";
import Chat from "./components/Chat.js";
import SignUp from "./components/SignUp.js";
import ErrorPage from "./components/ErrorPage.js";

import { selectAuthenticatedUser } from "./features/auth/authSlice.js";

import { socket } from "./socket.js";

function App() {
	// console.log("localStorage: ", localStorage);

	const username = localStorage.getItem("username");
	const token = localStorage.getItem("token");

	const dispatch = useDispatch();

	dispatch(setCredentials({ username, token }));

	const { user } = useSelector(selectAuthenticatedUser);
	// console.log("user: ", user);

	useEffect(() => {
		socket.on("newChannel", (payload) => {
			console.log(payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
		});

		return () => {
			socket.off("newChannel");
		};
	}, []);

	function emitChannel() {
		if (socket.connected) {
			socket.emit(
				"newChannel",
				{ id: 6, name: "new channel", removable: true },
				(err) => {
					if (err) {
						console.error("Error sending message:", err);
					} else {
						console.log("Message sent successfully");
					}
				}
			);
		} else {
			console.error("Socket is not connected");
		}
	}

	function handleLogout() {
		dispatch(logout()); // обновляем state → state.user = null и state.token = null
		localStorage.clear();
	}

	return (
		<>
			<button type="button" onClick={emitChannel}>
				emit newChannel
			</button>
			<button type="button" onClick={handleLogout}>
				Logout
			</button>

			<BrowserRouter>
				<Routes>
					{/* UNCOMMENTME */}
					<Route
						path="/login"
						element={user ? <Navigate to={"/"} /> : <Auth />}
					/>
					<Route
						path="/"
						element={user ? <Chat /> : <Navigate to={"/login"} />}
					/>
					<Route path="*" element={<Navigate to={"/"} />} />

					{/* DELETME */}
					{/* <Route path="*" element={<Chat />} /> */}

					<Route path="/signup" element={<SignUp />} />
					<Route path="/404" element={<ErrorPage />} />
				</Routes>
			</BrowserRouter>
			<button type="button" onClick={() => console.log(store.getState())}>
				store.getState
			</button>
		</>
	);
}

export default App;
