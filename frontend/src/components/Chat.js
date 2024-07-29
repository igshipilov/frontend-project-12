import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect } from "react";
import ChannelsList from "./ChannelsList.js";
import MessagesList from "./MessagesList.js";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useAddChannelMutation } from "../api/api.js";

import { channelAdded } from "../features/channels/channelsSlice.js";

function Chat() {
	const dispatch = useDispatch();
	const [addChannel] = useAddChannelMutation();
	const myChannels = useSelector((state) => state.channels);

	useEffect(() => {
		console.log('myChannels:', myChannels);
	}, []);

	// FIXME
	async function handleAddChannel() {
		try {
			const response = await addChannel({
				name: "test",
			}).unwrap();
			dispatch(channelAdded(response));
			console.log(response);
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
								<form>
									<div className="">
										<input
											name="body"
											placeholder="Введите новое сообщение"
										></input>
										<button type="button">Отправить</button>
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
