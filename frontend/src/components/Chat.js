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
import { setChannelById } from "../features/channels/getCurrentChannelIdSlice.js";

import { socket } from "../socket.js";

import { Formik } from "formik";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

function Chat() {
	const dispatch = useDispatch();

	useEffect(() => {
		socket.on("newMessage", (payload) => {
			console.log("socken.on newMessage → payload: ", payload);
			dispatch(setMessage(payload)); // setMessage – добавляем сообщение в store
		});

		return () => {
			socket.off("newMessage");
		};
	}, []);

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
	// const [userMessage, setUserMessage] = useState("");
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

			console.log("addMessage → response: ", response);
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

// FIXME функция добавления канала
// async function handleAddChannel() {
// 	const dispatch = useDispatch();
// 	const [addChannel] = useAddChannelMutation();

// 	try {
// 		const response = await addChannel({
// 			name: "test",
// 		}).unwrap();
// 		dispatch(channelAdded(response));
// 		console.log("addChannel → response: ", response);
// 	} catch (error) {
// 		console.log("Adding channel error:", error);
// 		throw new Error(error);
// 	}
// }

function FormAddChannel({ hideModal }) {
	const [addChannel, { error: addChannelError, isLoading: isAddingChannel }] =
		useAddChannelMutation();

	const dispatch = useDispatch();

	const {
		data: channels,
		isLoading: isChannelsLoading,
		error: ChannelLoadingError,
	} = useGetChannelsQuery();

	const lastChannelId = channels[channels.length - 1].id;

	const user = useSelector((state) => state.auth.user);
	const currentChannelId = useSelector((state) => state.currentChannelId);

	async function submitChannel(values) {
		try {
			const currentChannelId = lastChannelId + 1;

			const response = await addChannel({
				id: currentChannelId,
				name: values.name,
				removable: true,
			}).unwrap();

			hideModal();
			dispatch(setChannelById(currentChannelId));

			console.log("addChannel → response: ", response);
		} catch (error) {
			throw new Error(`submitChannel error: ${error}`);
		}
	}

	return (
		<Formik
			onSubmit={(values, { resetForm }) => {
				submitChannel(values);
				resetForm();
			}}
			initialValues={{
				name: "",
			}}
		>
			{({ handleSubmit, handleChange, values }) => (
				<>
					<Form noValidate onSubmit={handleSubmit}>
						<Row className="mb-3">
							<Form.Group
								as={Col}
								md="4"
								controlId="FormikMessage"
							>
								<InputGroup hasValidation>
									<Form.Control
										type="text"
										autoFocus
										aria-describedby="inputGroupPrepend"
										name="name"
										value={values.name}
										onChange={handleChange}
									/>
								</InputGroup>
							</Form.Group>
						</Row>

						<Button
							className="btn-secondary"
							onClick={() => hideModal()}
						>
							Отменить
						</Button>

						<Button type="submit" disabled={isAddingChannel}>
							{isAddingChannel ? "Отправляем" : "Отправить"}
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
	const myChannels = useSelector((state) => state.channels);

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
				<ChannelsList customChannels={myChannels} />
			</ul>
		</aside>
	);
}
