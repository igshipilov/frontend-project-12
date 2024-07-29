import { useState, useEffect, useLayoutEffect, useContext } from "react";
import AuthContext from "./AuthContext.js";

const AuthProvider = ({ children }) => {
	// console.log(localStorage.getItem('token'));

	const [isAuthenticated, setIsAuthenticated] = useState(false);

	function login() {
		setIsAuthenticated(true);
	}

	function logout() {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
	}

	useLayoutEffect(() => {
		if (!!localStorage.getItem("token")) {
			setIsAuthenticated(true);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
