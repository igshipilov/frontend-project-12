import "bootstrap/dist/css/bootstrap.css";

import React from "react";
import { useGetChannelsQuery } from "../api/api.js";

function ChannelsList() {
	// const { ids, entities } = customChannels;
	const { data: channels, isLoading, error } = useGetChannelsQuery();

	if (isLoading) return <div>Загружаем каналы...</div>;
	if (error) {
		console.log("Ошибка загрузки каналов!", error);
		return <div>Ошибка загрузки каналов! см. логи</div>;
	}

	return (
		<div>
			<ul className="list-unstyled">
				{channels.map(({ id, name }) => (
					<li key={id}>{name}</li>
				))}
				{/* {ids.map(({ id, name }) => (
					<li key={id}>{entities[id].name}</li>
				))} */}
			</ul>
		</div>
	);
}

export default ChannelsList;
