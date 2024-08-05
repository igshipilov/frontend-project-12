import React, { useState } from "react";
import { useLoginMutation } from "../api/api.js";
import { setCredentials } from "../features/auth/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { Formik } from "formik";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

function Auth() {
	const [credentialsCorrect, setCredentialsCorrect] = useState(true);
	const [login, { isLoading }] = useLoginMutation();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function handleAuth({ username, password }) {
		try {
			const userData = await login({ username, password }).unwrap(); // POST-запрос на сервер, в ответ получаем { token, username }
			// console.log("userData: ", userData);
			dispatch(setCredentials(userData)); // сохраняем в store объект { user, token }
			navigate("/");
			// console.log('userData: ', userData);
			localStorage.setItem("username", username);
			localStorage.setItem("token", userData.token);
		} catch (e) {
			const { statusCode } = e.data;
			switch (statusCode) {
				case 401:
					console.log("Неправильный логин и/или пароль:", e);
					setCredentialsCorrect(false);
					return;
				default:
					throw new Error("Failed to login:", e);
			}
		}
	}

	return (
		<Formik
			onSubmit={(values) => {
				handleAuth(values);
			}}
			initialValues={{
				username: "",
				password: "",
			}}
		>
			{({ handleSubmit, handleChange, values }) => (
				<>
					<a href="#" onClick={() => navigate("/signup")}>
						Регистрация
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
										isInvalid={!credentialsCorrect}
									/>
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
										isInvalid={!credentialsCorrect}
									/>
									<Form.Control.Feedback
										type="invalid"
										tooltip
									>
										{!credentialsCorrect &&
											"Неправильный логин и/или пароль"}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>
						</Row>

						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Входим..." : "Войти"}
						</Button>
					</Form>
				</>
			)}
		</Formik>
	);
}

export default Auth;
