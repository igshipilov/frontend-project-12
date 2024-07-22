import { useContext } from "react";
import AuthContext from "../Authentication/AuthContext.js";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useNavigate } from "react-router-dom";

import axios from "axios";

const FormikForm = () => {
	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	function signUp(values, token, setSubmitting) {
		return axios
			.post("/api/v1/signup", {
				username: values.email,
				password: values.password,
			})
			.then((response) => {
				authContext.login();
				setSubmitting(false);
				navigate("/");
				console.log("response.data: ", response.data); // => { token: "...", username: "..." }
				token = response.data.token;
				localStorage.setItem("token", token);
				console.log(localStorage.getItem("token"));
			})
			.then(() => console.log("!!!!!!!! signedUp succesfully"));
	}

	function getChannels(token) {
		return axios
			.get("/api/v1/channels", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				console.log(response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
			});
	}

	return (
		<div>
			<h1>Type in email and password</h1>
			<Formik
				initialValues={{ email: "", password: "" }}
				validate={(values) => {
					const errors = {};
					if (!values.email) {
						errors.email = "Required";
					} else if (
						!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
							values.email
						)
					) {
						errors.email = "Invalid email address";
					}
					return errors;
				}}
				onSubmit={async (values, { setSubmitting }) => {
					if (!!localStorage.getItem("token")) {
						// authContext.login(); // FIXME: временное решение – оно нужно, чтобы визуально тоже юзер оставался залогиненым
						// navigate("/");
					} else {
						// const token = localStorage.getItem("token");
						let token;
						await axios
							.post("/api/v1/signup", {
								username: values.email,
								password: values.password,
							})
							.then((response) => {
								authContext.login();
								setSubmitting(false);
								navigate("/");
								console.log("response.data: ", response.data); // => { token: "...", username: "..." }
								token = response.data.token;
								localStorage.setItem("token", token);
								console.log(localStorage.getItem("token"));
							})
							.then(() =>
								console.log("!!!!!!!! signedUp succesfully")
							);
						// signUp(values, token, setSubmitting);
						await getChannels(token);

						// Promise.all([
						// 	signUp(values, token, setSubmitting),
						// 	getChannels(token),
						// ]);

						// axios
						// 	.post("/api/v1/signup", {
						// 		username: values.email,
						// 		password: values.password,
						// 	})
						// 	.then((response) => {
						// 		authContext.login();
						// 		setSubmitting(false);
						// 		navigate("/");
						// 		console.log("response.data: ", response.data); // => { token: "...", username: "..." }
						// 		token = response.data.token;
						// 		localStorage.setItem("token", token);
						// 		console.log(localStorage.getItem("token"));
						// 	})
						// .get("/api/v1/channels", {
						// 	headers: {
						// 		Authorization: `Bearer ${token}`,
						// 	},
						// })
						// .then((response) => {
						// 	console.log(response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
						// });
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form className="form">
						<div>
							<Field
								type="email"
								name="email"
								className="input"
							/>
							<ErrorMessage
								name="email"
								component="div"
								className="error-message"
							/>
						</div>
						<div>
							<Field
								type="password"
								name="password"
								className="input"
							/>
							<ErrorMessage
								name="password"
								component="div"
								className="error-message"
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="button-submit"
						>
							Submit
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default FormikForm;
