import React, { useState } from "react";
import { useSignupMutation } from "../api/api.js";
import { setCredentials } from "../features/auth/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { Formik } from "formik";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import * as yup from "yup";

function SignUp() {
	const [userExists, setUserExists] = useState(false);
	const [signup, { isLoading }] = useSignupMutation();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function handleSignup({ username, password }) {
		try {
			const userData = await signup({ username, password }).unwrap(); // POST-запрос на сервер, в ответ получаем: { token, username }
			dispatch(setCredentials(userData)); // сохраняем в store объект: { user, token }
			navigate("/");
			localStorage.setItem("token", userData.token);
		} catch (e) {
			const { statusCode } = e.data;
			switch (statusCode) {
				case 409:
					setUserExists(true);
					console.log("This User Already Exists:", e);
					return;
				default:
					throw new Error("Failed to register:", e);
			}
		}
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
			onSubmit={(values) => {
				handleSignup(values);
			}}
			initialValues={{
				username: "",
				password: "",
				confirmpassword: "",
			}}
		>
			{({ handleSubmit, handleChange, values, errors }) => (
				<>
					<a href="#" onClick={() => navigate("/login")}>
						Вход
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

						<Button type="submit" disabled={isLoading}>
							{isLoading
								? "Регистрируемся..."
								: "Зарегистрироваться"}
						</Button>
					</Form>
				</>
			)}
		</Formik>
		// <form onSubmit={handleSubmit}>
		// 	<div>
		// 		<input
		// 			type="text"
		// 			value={username}
		// 			onChange={(e) => setUsername(e.target.value)}
		// 			placeholder="username"
		// 		></input>
		// 	</div>
		// 	<div>
		// 		<input
		// 			type="password"
		// 			value={password}
		// 			onChange={(e) => setPassword(e.target.value)}
		// 			placeholder="password"
		// 		></input>
		// 	</div>
		// 	<button type="submit" disabled={isLoading}>
		// 		{isLoading ? "Регистрируемся..." : "Зарегистрироваться"}
		// 	</button>
		// 	<div>
		// 		<Link to="/login" className="App-link">
		// 			Авторизоваться
		// 		</Link>
		// 	</div>
		// </form>
	);
}

export default SignUp;
