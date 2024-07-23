import { useContext } from "react";
import AuthContext from "../Authentication/AuthContext.js";

import store from "../store.js";
import { channelAdded } from "../features/channelsSlice.js";
import { messageAdded } from "../features/messagesSlice.js";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useNavigate } from "react-router-dom";

import axios from "axios";

const FormikForm = () => {
	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	async function signUp(values, setSubmitting) {
		const response = await axios.post("/api/v1/signup", {
			username: values.email,
			password: values.password,
		});

		authContext.login();
		setSubmitting(false);
		navigate("/");

		// console.log("response.data: ", response.data); // => { token: "...", username: "..." }

		const token = response.data.token;
		localStorage.setItem("token", token);

		// console.log("!!!!!!!! signedUp succesfully");

		return token;
	}

	async function getChannels(token) {
		const response = await axios.get("/api/v1/channels", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		console.log("Form.js → channels: ", response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
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
						authContext.login(); // FIXME: временное решение – оно нужно, чтобы визуально тоже юзер оставался залогиненым
						navigate("/");
					} else {
						const token = await signUp(values, setSubmitting);
						const channels = await getChannels(token);
						const messages = await getMessages(token);

						channels.map((channel) =>
							store.dispatch(channelAdded(channel))
						);
                        messages.map((message) =>
							store.dispatch(messageAdded(message))
						);
						// console.log(store.getState());
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
