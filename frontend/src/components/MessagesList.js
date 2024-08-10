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

	const activeChannelId = useSelector((state) => state.activeChannelId);

	const dispatch = useDispatch();

	const messagesState = useSelector(selectMessages);

	function filteredMessages() {
		const { ids, entities } = messagesState;

		const listedMessages = ids
			.map((id) => entities[id]) // получаем объект сообщения
			.filter(({ channelId }) => channelId === activeChannelId) // оставляем только сообщения, соответствующие текущему каналу
			.map(({ body }) => body) // вытаскиваем текст сообщения
			.map((text, id) => <li key={id}>{text}</li>); // "оформляем" в список

		return listedMessages;
	}

	useEffect(() => {
		// в реальном времени показывает только что отправленные сообщения
		socket.on("newMessage", (payload) => {
			dispatch(setMessage(payload));
			console.group("MessagesList.js");
			console.log(payload);
			console.groupEnd();
		});

		// подгружает весь список сообщений из store
		if (fetchedMessages) {
			dispatch(setMessages(fetchedMessages));
		}

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
