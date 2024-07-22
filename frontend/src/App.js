import { useContext, useState, useEffect, useLayoutEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

import LoginPage from "./Login/Login.js";
import ErrorPage from "./ErrorPage/ErrorPage.js";

import { BrowserRouter, Link, Navigate, Routes, Route } from "react-router-dom";

import AuthProvider from "./Authentication/AuthProvider.js";
import AuthContext from "./Authentication/AuthContext.js";

function MainPage() {
	return (
		<header className="App-header">
			<Link to="/login" className="App-link">
				Login
			</Link>

			<img src={logo} className="App-logo" alt="logo" />
		</header>
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
	const authContext = useContext(AuthContext);

    // debug, but not working
	// useEffect(() => {
	// 	console.log("authContext: ", authContext);
	// }, []);

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
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
