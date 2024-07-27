import "bootstrap/dist/css/bootstrap.css";

import { useContext, useState, useEffect, useLayoutEffect } from "react";
import { createSlice } from "@reduxjs/toolkit";

import { channelsAdded } from "./features/slices/channelsSlice.js";
import { messageAdded } from "./features/slices/messagesSlice.js";

import { useGetChannelsQuery } from "./features/RTKQuery/channelsApi.js"; // 🟡🟡🟡 РАСКОММЕНТЬ

import store from "./store.js";

// import logo from "./logo.svg";
import "./App.css";

import LoginPage from "./features/Login/LoginPage.js";
import FormSignUp from "./features/SignUp/FormSignUp.js";
import ErrorPage from "./ErrorPage/ErrorPage.js";
import FormExample from "./features/SignUp/FormExample.js";

import { BrowserRouter, Link, Navigate, Routes, Route } from "react-router-dom";

import AuthProvider from "./Authentication/AuthProvider.js";
import AuthContext from "./Authentication/AuthContext.js";

import axios from "axios";

function MainPage() {
	let channelsNamesList = ["hey"];
	// console.log("MainPage -- store.getState():", store.getState());
	// console.log(
	// 	'MainPage -- localStorage.getItem("token"):',
	// 	localStorage.getItem("token")
	// );

	const token = localStorage.getItem("token");

	// async function getChannels(token) {
	// 	const response = await axios.get("/api/v1/channels", {
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	});
	// 	// console.log("Form.js → channels: ", response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
	// 	return response.data;
	// }

	// async function getChannels(token) {
	// 	try {
	// 		const response = await axios.get("/api/v1/channels", {
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		});
	// 		console.log("channels: ", response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
	// 		return response.data;
	// 	} catch (e) {
	// 		console.log("getChannels error: ", e);
	// 	}
	// }

	// getChannels(token);

	// -----------------------------------
	// axios
	// 	.get("/api/v1/channels", {
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})
	// 	.then((response) => {
	// 		console.log("channels: ", response.data);

	// 		store.dispatch(channelsAdded(response.data));
	// 		console.log(
	// 			"store after channels store dispatch:",
	// 			store.getState()
	// 		);

	// 		const channelsIds = store.getState().channels.ids;
	// 		const channelsEntities = store.getState().channels.entities;

	// 		const channels = channelsIds.map((id) => channelsEntities[id]);
	// 		console.log("channels: ", channels);

	// 		channelsNamesList = channels.map(({ name }) => name);
	//         console.log('channelsNamesList: ', channelsNamesList);
	// 	})
	// 	.catch((e) => {
	// 		console.log("getChannels error: ", e);
	// 		throw new Error("Error while getting channels:", e);
	// 	});
	// -----------------------------------

	// async function getChannelsList() {
	// 	const state = store.getState();
	// 	const token = state.auth.token;

	// 	const channels = await getChannels(token);
	// 	// const messages = await getMessages(token);
	// 	console.log("channels: ", channels);

	// 	// channels.map((channel) =>
	// 	//     store.dispatch(channelAdded(channel))
	// 	// );
	// 	// messages.map((message) =>
	// 	//     store.dispatch(messageAdded(message))
	// 	// );

	// 	// const channels = state.channels;
	// 	const names = channels.map(() => channels.name); // FIXME вроде бы здесь как-то не так отрабатывает... см. логи

	// 	// console.log("App → channels: ", channels);
	// 	// console.log("App → names: ", names);
	// 	console.log("state: ", state);

	// 	return names;
	// }

	// channelsNamesList = getChannelsList();
	// console.log("channelsNamesList: ", channelsNamesList);

	// 🟡🟡🟡 РАСКОММЕНТЬ
	const { data, error, isLoading, refetch } = useGetChannelsQuery();
	// console.log("data: ", data);
    console.log('isLoading:', isLoading);

	// const names = data.map(({ name }) => name);
    const names = data.map(({ name }, id) => <li key={id}>{name}</li>);
	// console.log("names: ", names);

	channelsNamesList = names;

	return (
		<>
			<header className="App-header">
				<Link to="/login" className="App-link">
					Login
				</Link>
			</header>
			<div className="main">
				<div className="container">
					<div className="channels-bar">
						<div className="">
							<b>Каналы</b>
							<button type="button">+</button>
						</div>
						<ul id="channels-box">
							{/* {["one", "two"]} */}
							{/* {[<li>one</li>, <li>two</li>]} */}
							{channelsNamesList}
						</ul>
					</div>
					<div className="messages-container">
						<div className="">
							<div className="messages-head"></div>
							<div className="messages-box"></div>
							<div className="form">
								<form>
									<div className="">
										<input
											name="body"
											placeholder="Введите новое сообщение"
										></input>
										<button type="button">Отправить</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// children === <MainPage />
function PrivateRoute({ children }) {
	const authContext = useContext(AuthContext);

	if (!authContext.isAuthenticated) {
		return <Navigate to="/login" />;
	}

	return children;
}

function App() {
	useEffect(() => {
		// console.log("App.js → localStorage: ", localStorage);
	}, []);

	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="*"
						element={
							<PrivateRoute>
								<MainPage />
							</PrivateRoute>
						}
					/>
					<Route path="/404" element={<ErrorPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<FormSignUp />} />
					<Route path="/example" element={<FormExample />} />
				</Routes>
			</BrowserRouter>
			{/* <button type="button" onClick={() => myAddUser()}>testing Add User</button> */}
			<button type="button" onClick={() => console.log(store.getState())}>
				store.getState
			</button>
		</AuthProvider>
	);
}

export default App;
