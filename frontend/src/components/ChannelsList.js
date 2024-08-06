import "bootstrap/dist/css/bootstrap.css";

import React, { useEffect } from "react";
import { useGetChannelsQuery } from "../api/api.js";

import { useDispatch, useSelector } from "react-redux";
import { setChannelById } from "../features/channels/getCurrentChannelIdSlice.js";

import {
	channelsAdded,
	selectChannels,
} from "../features/channels/channelsSlice.js";

function ChannelsList() {
	const { data: fetchedChannels, isLoading, error } = useGetChannelsQuery();

	const dispatch = useDispatch();

	// const channels = fetchedChannels;
	const channelsState = useSelector(selectChannels);

	function channels() {
		const { ids, entities } = channelsState;

		const listedChannels = ids
			.map((id) => entities[id])
			.map(({ name }, id) => (
				<li
					key={id}
					onClick={() => dispatch(setChannelById(Number(id)))}
				>
					{name}
				</li>
			));

		return listedChannels;
	}

	useEffect(() => {
		if (fetchedChannels) {
			dispatch(channelsAdded(fetchedChannels));
		}
	}, [fetchedChannels, dispatch]);

	if (isLoading) return <div>Загружаем каналы...</div>;

	if (error) {
		console.error("Ошибка загрузки каналов!", error);
		return <div>Ошибка загрузки каналов! см. логи</div>;
	}

	// console.log("channels: ", channels);

	return (
		<div>
			<ul className="list-unstyled">{channels()}</ul>
		</div>
	);
}

export default ChannelsList;
