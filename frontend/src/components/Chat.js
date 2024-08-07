import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect, useState } from "react";

import ChannelsList from "./ChannelsList.js";
import MessagesList from "./MessagesList.js";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
	useAddChannelMutation,
	useGetChannelsQuery,
	useAddMessageMutation,
} from "../api/api.js";

import { channelAdded } from "../features/channels/channelsSlice.js";
import { setMessage } from "../features/messages/messagesSlice.js";
import { setChannelById } from "../features/channels/currentChannelIdSlice.js";

import { selectChannels } from "../features/channels/channelsSlice.js";

import { socket } from "../socket.js";

import { Formik } from "formik";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

import * as yup from "yup";

function Chat() {
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	socket.on("newMessage", (payload) => {
	// 		console.log("socken.on newMessage → payload: ", payload);
	// 		// dispatch(setMessage(payload)); // setMessage – добавляем сообщение в store
	// 	});

	// 	socket.on("newChannel", (payload) => {
	// 		console.log("socken.on newChannel → payload: ", payload); // { id: 6, name: "new channel", removable: true }
	// 	});

	// 	// subscribe remove channel
	// 	socket.on("removeChannel", (payload) => {
	// 		console.log("socken.on removeChannel → payload: ", payload); // { id: 6 };
	// 	});

	// 	socket.on("renameChannel", (payload) => {
	// 		console.log("socken.on renameChannel → payload: ", payload); // { id: 7, name: "new name channel", removable: true }
	// 	});

	// 	return () => {
	// 		socket.off("newMessage");
	// 		socket.off("newChannel");
	// 		socket.off("removeChannel");
	// 		socket.off("renameChannel");
	// 	};
	// }, []);

	return (
		<>
			<div className="main">
				<div className="container">
					<Channels />
					<MessagesContainer />
				</div>
			</div>
		</>
	);
}

export default Chat;

function MessagesContainer() {
	return (
		<div className="messages-container">
			<div className="">
				<div className="messages-head">
					<h3>Messages Head</h3>
				</div>
				<div className="messages-box">
					<MessagesList />
				</div>
				<div className="form">
					<FormSendMessage />
				</div>
			</div>
		</div>
	);
}

function FormSendMessage() {
	const [addMessage, { error: addMessageError, isLoading: isAddingMessage }] =
		useAddMessageMutation();

	const user = useSelector((state) => state.auth.user);
	const currentChannelId = useSelector((state) => state.currentChannelId);

	async function submitMessage(values) {
		try {
			// addMessage – это RTK Query post-запрос через api сервера
			const response = await addMessage({
				body: values.message,
				channelId: currentChannelId,
				username: user,
			}).unwrap();

			// console.log("addMessage → response: ", response);
		} catch (error) {
			throw new Error(`submitMessage error: ${error}`);
		}
	}

	return (
		<Formik
			onSubmit={(values, { resetForm }) => {
				submitMessage(values);
				resetForm();
			}}
			initialValues={{
				message: "",
			}}
		>
			{({ handleSubmit, handleChange, values }) => (
				<>
					<Form
						noValidate
						onSubmit={handleSubmit}
						className="bg-dark"
					>
						<Row className="mb-3">
							<Form.Group
								as={Col}
								md="4"
								controlId="FormikMessage"
							>
								<Form.Label>message</Form.Label>
								<InputGroup hasValidation>
									<Form.Control
										type="text"
										placeholder="Введите сообщение"
										autoFocus
										aria-describedby="inputGroupPrepend"
										name="message"
										value={values.message}
										onChange={handleChange}
									/>
								</InputGroup>
							</Form.Group>
						</Row>

						<Button type="submit" disabled={isAddingMessage}>
							{isAddingMessage ? "Отправляем" : "Отправить"}
						</Button>
					</Form>
				</>
			)}
		</Formik>
	);
}

function FormAddChannel({ hideModal }) {
	const [
		addChannel,
		{ error: addChannelError, isLoading: isddChannelLoading },
	] = useAddChannelMutation();

	const dispatch = useDispatch();

	const {
		data: channels,
		isLoading: isChannelsLoading,
		error: ChannelLoadingError,
	} = useGetChannelsQuery();

	const channelsNames = channels.map(({ name }) => name);

	const lastChannelId = channels[channels.length - 1].id;

	async function submitChannel(values) {
		try {
			const currentChannelId = lastChannelId + 1;

			const response = await addChannel({
				id: currentChannelId,
				name: values.name,
				removable: true,
			}).unwrap();

			hideModal();
			dispatch(setChannelById(Number(lastChannelId) + 1)); // переводим юзера на созданный канал

			console.log("addChannel → response: ", response);
		} catch (error) {
			throw new Error(`submitChannel error: ${error}`);
		}
	}

	const validationSchema = yup.object({
		name: yup
			.string()
			.required("Надо ввести хоть какое-нибудь название :с")
			.min(3, "От 3 до 20 символов")
			.max(20, "От 3 до 20 символов")
			.notOneOf(
				channelsNames,
				"Такое название уже существует, надо уникальное >_<"
			),
	});

	return (
		<Formik
			validationSchema={validationSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={(values, { resetForm }) => {
				submitChannel(values);
				resetForm();
			}}
			initialValues={{
				name: "",
			}}
		>
			{({ handleSubmit, handleChange, values, errors }) => (
				<>
					<Form noValidate onSubmit={handleSubmit}>
						<Row className="mb-3">
							<Form.Group
								as={Col}
								md="4"
								controlId="FormikAddChannel"
							>
								<InputGroup hasValidation>
									<Form.Control
										type="text"
										autoFocus
										aria-describedby="inputGroupPrepend"
										name="name"
										value={values.name}
										onChange={handleChange}
										isInvalid={!!errors.name}
									/>
									<Form.Control.Feedback
										type="invalid"
										tooltip
									>
										{errors.name}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>
						</Row>

						<Button
							className="btn-secondary"
							onClick={() => hideModal()}
						>
							Отменить
						</Button>

						<Button type="submit" disabled={isddChannelLoading}>
							{isddChannelLoading ? "Отправляем" : "Отправить"}
						</Button>
					</Form>
				</>
			)}
		</Formik>
	);
}

function ModalAddChannel(props) {
	// console.log('props: ', props);
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Добавить канал
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormAddChannel hideModal={props.onHide} />
			</Modal.Body>
		</Modal>
	);
}

function Channels() {
	const [modalShow, setModalShow] = useState(false);

	return (
		<aside className="channels-bar">
			<div className="">
				<h3>Каналы</h3>
				<Button variant="primary" onClick={() => setModalShow(true)}>
					+
				</Button>
				<ModalAddChannel
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
			</div>
			<ul id="channels-box">
				<ChannelsList />
			</ul>
		</aside>
	);
}
