import { useContext, useState } from "react";
import { createSlice } from "@reduxjs/toolkit";
import AuthContext from "../../Authentication/AuthContext.js";
import "bootstrap/dist/css/bootstrap.css";

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
				username: values.email,
				password: values.password,
			});

			authContext.login();
			setSubmitting(false);

			console.log("response.data: ", response.data); // => { token: "...", username: "..." }

			// const user = response.data.username;
			const token = response.data.token;

			store.dispatch(setCredentials(response.data));
			localStorage.setItem("token", token);

			console.log("store after token dispatch: ", store.getState());
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
		email: yup.string().email(),
		password: yup
			.string()
			.required("Password is required")
			.min(5, "Your password is too short.")
			.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
		confirmpassword: yup
			.string()
			.oneOf([yup.ref("password")], "Passwords must match"),
	});

	const message = (msg) => <div>{userExists ? "ALREADY EXISTS" : msg}</div>;

	return (
		<Formik
			validationSchema={validationSchema}
			onSubmit={(values) => console.log(values)}
			initialValues={{
				email: "",
				password: "",
				confirmpassword: "",
			}}
		>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<Form noValidate onSubmit={handleSubmit} className="bg-dark">
					<Row className="mb-3">
						<Form.Group
							as={Col}
							md="4"
							controlId="validationFormikEmail"
						>
							<Form.Label>email</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="email"
									aria-describedby="inputGroupPrepend"
									name="email"
									value={values.email}
									onChange={handleChange}
									isInvalid={!!errors.email}
								/>
								<Form.Control.Feedback type="invalid" tooltip>
									{errors.email}
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
									type="text"
									placeholder="password"
									aria-describedby="inputGroupPrepend"
									name="password"
									value={values.password}
									onChange={handleChange}
									isInvalid={!!errors.password}
								/>
								<Form.Control.Feedback type="invalid" tooltip>
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
									type="text"
									placeholder="confirm password"
									aria-describedby="inputGroupPrepend"
									name="confirmpassword"
									value={values.confirmpassword}
									onChange={handleChange}
									isInvalid={!!errors.confirmpassword}
								/>
								<Form.Control.Feedback type="invalid" tooltip>
									{errors.confirmpassword}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
					</Row>

					<Button type="submit">Submit form</Button>
				</Form>
			)}
		</Formik>
	);
};

export default FormSignUp;
