import "./Login.css";

import { useContext } from "react";
import AuthContext from "../Authentication/AuthContext.js";

import { Link } from "react-router-dom";

import Form from "./Form.js";

function FormOrText() {
	const authContext = useContext(AuthContext);

	return (
		<>
			{authContext.isAuthenticated ? (
				<h1 className="text-highlight">You logged IN</h1>
			) : (
				<Form />
			)}
		</>
	);
}

function LogoutButtonOrText() {
	const authContext = useContext(AuthContext);

	return (
		<>
			<h1 className="text-highlight red">
				{authContext.isAuthenticated ? (
					<button onClick={authContext.logout} type="button">
						Logout
					</button>
				) : (
					"you logged OUT"
				)}
			</h1>
		</>
	);
}

function LoginPage() {
	return (
		<>
			<Link to="/" className="App-link">
				Home
			</Link>

			<FormOrText />
			<LogoutButtonOrText />
		</>
	);
}

export default LoginPage;
