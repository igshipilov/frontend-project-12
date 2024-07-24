import { useContext } from "react";
import { createSlice } from "@reduxjs/toolkit";
import AuthContext from "../../Authentication/AuthContext.js";

import store from "../../store.js";

import { channelAdded } from "../slices/channelsSlice.js";
import { messageAdded } from "../slices/messagesSlice.js";
import { setCredentials } from "../auth/authSlice.js";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import * as yup from "yup";

const FormSignUp = () => {
	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	async function signUp(values, setSubmitting) {
		try {
			const response = await axios.post("/api/v1/signup", {
				username: values.email,
				password: values.password,
			});

			authContext.login();
			setSubmitting(false);

			console.log("response.data: ", response.data); // => { token: "...", username: "..." }

			const user = response.data.username;
			const token = response.data.token;

			store.dispatch(setCredentials(response.data));
			localStorage.setItem("token", token);

			console.log("store after token dispatch: ", store.getState());
			// console.log("!!!!!!!! signedUp succesfully");

			navigate("/");
			return token;
		} catch (e) {
			console.log("signUP error: ", e);
			console.log("e.response.status: ", e.response.status);
		}
	}

	async function getChannels(token) {
		const response = await axios.get("/api/v1/channels", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log("Form.js → channels: ", response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
		return response.data;
	}

	async function getMessages(token) {
		const response = await axios.get("/api/v1/messages", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log("messages: ", response.data);
		return response.data;
	}

	return (
		<div>
			<h1>Type in email and password</h1>
			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={yup.object({
					password: yup
						.string()
						.required("Password is required")
						.min(5, "Your password is too short.")
						.matches(
							/[a-zA-Z]/,
							"Password can only contain Latin letters."
						),
					confirmpassword: yup
						.string()
						.oneOf([yup.ref("password")], "Passwords must match"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					await signUp(values, setSubmitting);
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
						<div>
							<Field
								type="password"
								name="confirmpassword"
								className="input"
							/>
							<ErrorMessage
								name="confirmpassword"
								component="div"
								className="error-message"
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="button-submit"
						>
							Зарегистрироваться
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default FormSignUp;
