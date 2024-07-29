import "bootstrap/dist/css/bootstrap.css";

import { useContext, useState, useEffect, useLayoutEffect } from "react";

import store from "./app/store.js";

import "./App.css";

import { BrowserRouter, Link, Navigate, Routes, Route } from "react-router-dom";

import { useSelector } from "react-redux";
import Auth from "./components/Auth.js";
import Chat from "./components/Chat.js";
import SignUp from "./components/SignUp.js";
import ErrorPage from "./components/ErrorPage.js";

function App() {
	const { user } = useSelector((state) => state.auth);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={user ? <Navigate to={"/chat"} /> : <Auth />}
					/>
					<Route
						path="/chat"
						element={user ? <Chat /> : <Navigate to={"/login"} />}
					/>
					<Route path="/" element={<Navigate to={"/chat"} />} />
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
