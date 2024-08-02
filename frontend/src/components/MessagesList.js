import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	useGetMessagesQuery,
	useAddMessageMutation,
	useRemoveMessageMutation,
} from "../api/api.js";

import { setMessage, setMessages } from "../features/messages/messagesSlice.js";

function MessagesList() {
	const { data: messages, isLoading, error, refetch } = useGetMessagesQuery();
	// const [removeMessage] = useRemoveMessageMutation(); // DELETE

	const dispatch = useDispatch();
	const filteredMessages = useSelector((state) => {
		// return state.messages;
		const { ids, entities } = state.messages;
		const filteredIds = ids.filter(
			(id) => typeof entities[id]?.body === "string"
		);
		const result = filteredIds.map((id) => entities[id]);
		const fin = result.map(({ body, id }) => <li key={id}>{body}</li>);

		return fin;
	});

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

	// console.log("MessagesList.js → messages:", messages);
	// console.log("filteredMessages: ", filteredMessages);

	return (
		<div>
			{/* DELETME */}
			{/* <button type="button" onClick={removeAllMessages}>
				remove all messages
			</button> */}

			<ul className="list-unstyled">{filteredMessages}</ul>
		</div>
	);
}

export default MessagesList;
