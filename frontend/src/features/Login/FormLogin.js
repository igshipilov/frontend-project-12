import "bootstrap/dist/css/bootstrap.css";

import { useContext, useState, useRef } from "react";
import { createSlice } from "@reduxjs/toolkit";
import AuthContext from "../../Authentication/AuthContext.js";

import store from "../../store.js";

import { channelAdded } from "../slices/channelsSlice.js";
import { messageAdded } from "../slices/messagesSlice.js";
import { setCredentials } from "../auth/authSlice.js";

// import { Formik, Form, Field, ErrorMessage } from "formik";
import { Formik } from "formik";

import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import * as yup from "yup";

import { useNavigate } from "react-router-dom";

import axios from "axios";

const FormLogin = () => {
	const [unknownUser, setUnknownUser] = useState(false);
	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

	const usernameRef = useRef(null);
	const passwordRef = useRef(null);

	// FIXME: Это заглушка. Напиши рабочую версию.
	async function signIn(values) {
		try {
			await axios.post("/api/v1/login", {
				username: values.username,
				password: values.password,
			});
			setUnknownUser(false);
			authContext.login();
			navigate("/");
		} catch (e) {
			const statusCode = e.response.status;

			if (usernameRef.current) {
				usernameRef.current.focus();
				console.log(!!usernameRef.current.value);
			}
			switch (statusCode) {
				case 401:
					setUnknownUser(true);

				default:
					console.log("login error:", e);
					throw new Error(e);
			}

			// console.log("login error:", e);
			// throw new Error(e);
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

	function handleSubmitMy(e, values) {
		e.preventDefault();
		console.log(values);
	}

	return (
		<Formik
			onSubmit={(values) => signIn(values)}
			initialValues={{
				username: "",
				password: "",
			}}
		>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<>
					<Form
						noValidate
						onSubmit={handleSubmit}
						// onSubmit={(e) => handleSubmitMy(e, values)}
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
										ref={usernameRef}
										type="text"
										placeholder="username"
										autoFocus
										aria-describedby="inputGroupPrepend"
										name="username"
										value={values.username}
										onChange={handleChange}
										isInvalid={unknownUser}
									/>
									<Form.Control.Feedback
										type="invalid"
										tooltip
									>
										{unknownUser &&
											"Неверные имя пользователя или пароль"}
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
										ref={passwordRef}
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
						</Row>

						<Button type="submit">Войти</Button>
					</Form>
					<a href="#" onClick={() => navigate("/signup")}>
						Регистрация
					</a>
				</>
			)}
		</Formik>
	);
};

export default FormLogin;
