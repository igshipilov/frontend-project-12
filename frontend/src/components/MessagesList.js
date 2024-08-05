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

function MessagesList() {
	const currentChannelId = useSelector((state) => state.currentChannelId);

	const { data: messages, isLoading, error, refetch } = useGetMessagesQuery();
	// const [removeMessage] = useRemoveMessageMutation(); // это я пытался удалить все сообщения, не сработало

	const dispatch = useDispatch();

	const myMessages = useSelector(selectMessages);

	const filteredMessages = () => {
		const { ids, entities } = myMessages;

		const listedMessages = ids
			.map((id) => entities[id]) // получаем объект сообщения
			.filter(({ channelId }) => channelId === currentChannelId) // оставляем только сообщения, соответствующие текущему каналу
			.map(({ body }) => body) // вытаскиваем текст сообщения
			.map((text, id) => <li key={id}>{text}</li>); // "оформляем" в список

		return listedMessages;
	};

	// FIXME or DELETE -- это я пытался удалить все сообщения, потому что криво насохранял:
	// не у всех есть typeof body === "string"
	// async function removeAllMessages() {
	// 	// messages.map(async ({ id }) => await removeMessage(id));
	// 	await removeMessage("20");
	// 	refetch();
	// }

	useEffect(() => {
		// Помещаем dispatch в useEffect, потому что dispatch вызывается во время рендеринга,
		// а useEffect выполняет помещённый в него код только, как компонент смонтирован и данные загружены
		if (messages) {
			dispatch(setMessages(messages));
		}
		// dispatch(setMessage(messages));
		// console.log("MessagesList → myMessages: ", myMessages);
		// console.log("messages: ", messages);
		// console.log("filteredMessages: ", filteredMessages);
		// socket.on("newMessage", (payload) => {
		// 	console.log("socket.on newMessage → payload: ", payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
		// 	setMessagesList([...messagesList, payload.body]);
		// 	console.log("messagesList: ", messagesList);
		// 	console.log("myMessages: ", myMessages);
		// });
		// return () => {
		// 	socket.off("newMessage");
		// };
	}, [messages, dispatch]);

	if (isLoading) return <div>Загружаем сообщения...</div>;

	if (error) {
		console.log("Ошибка загрузки сообщений!", error);
		return <div>Ошибка загрузки сообщений! см. логи</div>;
	}

	return (
		<div>
			{/* DELETME */}
			{/* <button type="button" onClick={removeAllMessages}>
				remove all messages
			</button> */}

			<ul className="list-unstyled">{filteredMessages()}</ul>
		</div>
	);
}

export default MessagesList;
