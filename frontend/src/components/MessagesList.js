import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	useGetMessagesQuery,
	useAddMessageMutation,
	useRemoveMessageMutation,
} from "../api/api.js";

import {
	setMessage,
	setMessages,
	selectMessages,
} from "../features/messages/messagesSlice.js";

import { socket } from "../socket.js";

function MessagesList() {
	const {
		data: fetchedMessages,
		isLoading,
		error,
		refetch,
	} = useGetMessagesQuery();

	const currentChannelId = useSelector((state) => state.currentChannelId);

	const dispatch = useDispatch();

	const messagesState = useSelector(selectMessages);

	function filteredMessages() {
		const { ids, entities } = messagesState;

		const listedMessages = ids
			.map((id) => entities[id]) // получаем объект сообщения
			.filter(({ channelId }) => channelId === currentChannelId) // оставляем только сообщения, соответствующие текущему каналу
			.map(({ body }) => body) // вытаскиваем текст сообщения
			.map((text, id) => <li key={id}>{text}</li>); // "оформляем" в список

		return listedMessages;
	}

	useEffect(() => {
		socket.on("newMessage", (payload) => {
			console.log("socket.on → 'newMessage' payload: ", payload);
			dispatch(setMessage(payload));
		});
		// Помещаем dispatch в useEffect, потому что dispatch вызывается во время рендеринга,
		// а useEffect выполняет помещённый в него код только, как компонент смонтирован и данные загружены
		// if (fetchedMessages) {
		// 	dispatch(setMessages(fetchedMessages));
		// }

		// dispatch(setMessage(fetchedMessages));
		// console.log("MessagesList → messages: ", messages);
		// console.log("messages: ", messages);
		// console.log("filteredMessages: ", filteredMessages);

		// socket.on("newMessage", (payload) => {
		// 	console.log("socket.on newMessage → payload: ", payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
		// 	setMessagesList([...messagesList, payload.body]);
		// 	console.log("messagesList: ", messagesList);
		// 	console.log("messages: ", messages);
		// });

		return () => {
			socket.off("newMessage");
		};
	}, [fetchedMessages, dispatch]);

	if (isLoading) return <div>Загружаем сообщения...</div>;

	if (error) {
		console.log("Ошибка загрузки сообщений!", error);
		return <div>Ошибка загрузки сообщений! см. логи</div>;
	}

	return (
		<div>
			<ul className="list-unstyled">{filteredMessages()}</ul>
		</div>
	);
}

export default MessagesList;
