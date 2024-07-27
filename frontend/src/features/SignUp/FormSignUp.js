import "bootstrap/dist/css/bootstrap.css";

import { useContext, useState } from "react";
import { createSlice } from "@reduxjs/toolkit";
import AuthContext from "../../Authentication/AuthContext.js";

import store from "../../store.js";

import { channelAdded } from "../slices/channelsSlice.js";
import { messageAdded } from "../slices/messagesSlice.js";
import { setCredentials } from "../auth/authSlice.js";

import { useNavigate } from "react-router-dom";

import axios from "axios";

// import { Formik, Form, Field, ErrorMessage } from "formik";
import { Formik } from "formik";

import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import * as yup from "yup";

const FormSignUp = () => {
	const [userExists, setUserExists] = useState(false);

	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	async function signUp(values, setSubmitting) {
		try {
			const response = await axios.post("/api/v1/signup", {
				username: values.username,
				password: values.password,
			});

			authContext.login();
			// setSubmitting(false);

			console.log("response.data: ", response.data); // => { token: "...", username: "..." }

			// const user = response.data.username;
			const token = response.data.token;

			store.dispatch(setCredentials(response.data));
			localStorage.setItem("token", token);

			console.log("store after user-and-token dispatch: ", store.getState());
			navigate("/");
			return token;
		} catch (e) {
			console.log("signUP error: ", e);
			console.log("e.response.status: ", e.response.status);
			setUserExists(true);
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

	const validationSchema = yup.object({
		username: yup.string().required(),
		password: yup
			.string()
			.required("Password is required")
			.min(5, "Your password is too short.")
			.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
		confirmpassword: yup
			.string()
			.oneOf([yup.ref("password")], "Passwords must match"),
	});

	return (
		<Formik
			validationSchema={validationSchema}
			// onSubmit={(values) => console.log(values)}
			onSubmit={(values) => signUp(values)}
			initialValues={{
				username: "",
				password: "",
				confirmpassword: "",
			}}
		>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<>
					<a href="#" onClick={() => navigate("/login")}>
						Войти
					</a>
					<Form
						noValidate
						onSubmit={handleSubmit}
						className="bg-dark"
					>
						<Row className="mb-3">
							<Form.Group
								as={Col}
								md="4"
								controlId="validationFormikUsername"
							>
								<Form.Label>username</Form.Label>
								<InputGroup hasValidation>
									<Form.Control
										type="text"
										placeholder="username"
										autoFocus
										aria-describedby="inputGroupPrepend"
										name="username"
										value={values.username}
										onChange={handleChange}
										isInvalid={
											!!errors.username || userExists
										}
									/>
									<Form.Control.Feedback
										type="invalid"
										tooltip
									>
										{errors.username}
										{!errors.username &&
											userExists &&
											"This User Already Exists"}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>

							<Form.Group
								as={Col}
								md="4"
								controlId="validationFormikPasword"
							>
								<Form.Label>password</Form.Label>
								<InputGroup hasValidation>
									<Form.Control
										type="password"
										placeholder="password"
										aria-describedby="inputGroupPrepend"
										name="password"
										value={values.password}
										onChange={handleChange}
										isInvalid={!!errors.password}
									/>
									<Form.Control.Feedback
										type="invalid"
										tooltip
									>
										{errors.password}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>

							<Form.Group
								as={Col}
								md="4"
								controlId="validationFormikConfirmpassword"
							>
								<Form.Label>confirmpassword</Form.Label>
								<InputGroup hasValidation>
									<Form.Control
										type="password"
										placeholder="confirm password"
										aria-describedby="inputGroupPrepend"
										name="confirmpassword"
										value={values.confirmpassword}
										onChange={handleChange}
										isInvalid={!!errors.confirmpassword}
									/>
									<Form.Control.Feedback
										type="invalid"
										tooltip
									>
										{errors.confirmpassword}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>
						</Row>

						<Button type="submit">Зарегистрироваться</Button>
					</Form>
				</>
			)}
		</Formik>
	);
};

export default FormSignUp;
