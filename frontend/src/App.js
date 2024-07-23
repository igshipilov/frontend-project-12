import { useContext, useState, useEffect, useLayoutEffect } from "react";
import store from "./store.js";

import logo from "./logo.svg";
import "./App.css";

import LoginPage from "./Login/Login.js";
import ErrorPage from "./ErrorPage/ErrorPage.js";

import { BrowserRouter, Link, Navigate, Routes, Route } from "react-router-dom";

import AuthProvider from "./Authentication/AuthProvider.js";
import AuthContext from "./Authentication/AuthContext.js";

function MainPage() {
	let channelsNamesList;
	useEffect(() => {
		function getChannelsList() {
			const state = store.getState();
			const channels = state.channels;
			const names = channels.ids.map((id) => channels.entities[id].name);
            
			console.log("App → channels: ", channels);
			console.log("App → names: ", names);

            return names;
		}

		channelsNamesList = getChannelsList();
        console.log('channelsNamesList: ', channelsNamesList);
	}, []);

	return (
		<>
			<header className="App-header">
				<Link to="/login" className="App-link">
					Login
				</Link>

				{/* <img src={logo} className="App-logo" alt="logo" /> */}
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

// DELETME: testing func
// function myAddUser() {
//     const user = { id: 0, name: "Ivan", comments: [] };

//     store.dispatch(userAdded(user));
//     const selectUsers = (state) => state.users;

//     const users = selectUsers(store.getState());

//     console.log(store.getState());
// };

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* DELETME когда закончишь CSS */}
					<Route path="*" element={<MainPage />}></Route>

					{/* РАСКОММЕНТЬ, когда закончишь CSS */}
					{/* <Route
						path="*"
						element={
							<PrivateRoute>
								<MainPage />
							</PrivateRoute>
						}
					/> */}
					<Route path="/404" element={<ErrorPage />} />
					<Route path="/login" element={<LoginPage />} />
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
