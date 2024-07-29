import "bootstrap/dist/css/bootstrap.css";

import React from "react";
import { useGetMessagesQuery } from "../api/api.js";

function MessagesList() {
	const { data: messages, isLoading, error } = useGetMessagesQuery();

	if (isLoading) return <div>Загружаем сообщения...</div>;
	if (error) {
		console.log("Ошибка загрузки сообщений!", error);
		return <div>Ошибка загрузки сообщений! см. логи</div>;
	}

	return (
		<div>
			<ul className="list-unstyled">
				{messages.map(({ id, name }) => (
					<li key={id}>{name}</li>
				))}
				<li>test msg 1</li>
				<li>test msg 2</li>
				<li>test msg 3</li>
			</ul>
		</div>
	);
}

export default MessagesList;
