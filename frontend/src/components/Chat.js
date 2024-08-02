import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect, useState } from "react";
import ChannelsList from "./ChannelsList.js";
import MessagesList from "./MessagesList.js";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useAddChannelMutation, useAddMessageMutation } from "../api/api.js";

import { channelAdded } from "../features/channels/channelsSlice.js";
import { setMessage } from "../features/messages/messagesSlice.js";

import { socket } from "../socket.js";

function Chat() {
	const [userMessage, setUserMessage] = useState("");

	const dispatch = useDispatch();

	const [addChannel] = useAddChannelMutation();
	const [addMessage, { error: addMessageError, isLoading: isAddingMessage }] =
		useAddMessageMutation();

	const myChannels = useSelector((state) => state.channels);

	async function submitMessage(e) {
		e.preventDefault();

		console.log("userMessage", userMessage);
		try {
			// addMessage – это RTK Query post-запрос через api сервера
			const response = await addMessage({
				body: userMessage,
				channelId: 1,
				username: "admin",
			}).unwrap();

			console.log("addMessage → response: ", response);
		} catch (error) {
			throw new Error(`submitMessage error: ${error}`);
		}
	}

	useEffect(() => {
		socket.on("newMessage", (payload) => {
			console.log("socken.on newMessage → payload: ", payload);
			dispatch(setMessage(payload)); // setMessage – добавляем сообщение в store
		});

		return () => {
			socket.off("newMessage");
		};
	}, []);

	// FIXME
	async function handleAddChannel() {
		try {
			const response = await addChannel({
				name: "test",
			}).unwrap();
			dispatch(channelAdded(response));
			console.log("addChannel → response: ", response);
		} catch (error) {
			console.log("Adding channel error:", error);
			throw new Error(error);
		}
	}

	return (
		<>
			<header className="App-header">
				<Link to="/login" className="App-link">
					Login
				</Link>
			</header>
			<div className="main">
				<div className="container">
					<aside className="channels-bar">
						<div className="">
							<b>Каналы</b>
							<button type="button" onClick={handleAddChannel}>
								+
							</button>
						</div>
						<ul id="channels-box">
							<ChannelsList customChannels={myChannels} />
						</ul>
					</aside>
					<div className="messages-container">
						<div className="">
							<div className="messages-head"></div>
							<div className="messages-box">
								<MessagesList />
							</div>
							<div className="form">
								<form onSubmit={(e) => submitMessage(e)}>
									<div className="">
										<input
											name="body"
											placeholder="Введите новое сообщение"
											onChange={(e) =>
												setUserMessage(e.target.value)
											}
										></input>
										<button type="submit">Отправить</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Chat;
