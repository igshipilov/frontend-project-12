import { useState, useEffect } from "react";
import AuthContext from "./AuthContext.js";

const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	function login() {
		setIsAuthenticated(true);
	}

	function logout() {
		setIsAuthenticated(false);
	}

	return (
		<AuthContext.Provider value={{ login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
