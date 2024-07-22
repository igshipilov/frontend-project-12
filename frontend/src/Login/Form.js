import { useContext } from "react";
import AuthContext from "../Authentication/AuthContext.js";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useNavigate } from "react-router-dom";

import axios from "axios";

const FormikForm = () => {
	const authContext = useContext(AuthContext);
	const navigate = useNavigate();

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
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						authContext.login();
						setSubmitting(false);
						navigate("/");
					}, 400);
                    axios.post('/api/v1/signup', { username: 'newuser', password: '123456' }).then((response) => {
                        console.log(response.data); // => { token: ..., username: 'newuser' }
                      });
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
