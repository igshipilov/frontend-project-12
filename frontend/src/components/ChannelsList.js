import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect } from "react";
import { useGetChannelsQuery } from "../api/api.js";

import { useDispatch, useSelector } from "react-redux";
import { getChannelById } from "../features/channels/getCurrentChannelIdSlice.js";

import { channelsAdded } from "../features/channels/channelsSlice.js";

function ChannelsList() {
	// const { ids, entities } = customChannels;
	const { data: fetchedChannels, isLoading, error } = useGetChannelsQuery();

	const dispatch = useDispatch();

	const channels = fetchedChannels;

	useEffect(() => {
		if (fetchedChannels) {
			dispatch(channelsAdded(fetchedChannels));
		}
	}, []);

	if (isLoading) return <div>Загружаем каналы...</div>;
	if (error) {
		console.error("Ошибка загрузки каналов!", error);
		return <div>Ошибка загрузки каналов! см. логи</div>;
	}

	return (
		<div>
			<ul className="list-unstyled">
				{channels.map(({ id, name }) => (
					<li
						key={id}
						onClick={() => dispatch(getChannelById(Number(id)))}
					>
						{name}
					</li>
				))}
				{/* {ids.map(({ id, name }) => (
					<li key={id}>{entities[id].name}</li>
				))} */}
			</ul>
		</div>
	);
}

export default ChannelsList;
