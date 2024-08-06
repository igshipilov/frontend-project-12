import "bootstrap/dist/css/bootstrap.css";

import React, { useState, useEffect } from "react";
import { useGetChannelsQuery, useRemoveChannelMutation } from "../api/api.js";

import { useDispatch, useSelector } from "react-redux";
import { setChannelById } from "../features/channels/currentChannelIdSlice.js";

import {
	channelsAdded,
	channelRemoved,
	selectChannels,
} from "../features/channels/channelsSlice.js";

import { selectMessages } from "../features/messages/messagesSlice.js";

import { selectCurrentChannelId } from "../features/channels/currentChannelIdSlice.js";

import {
	Button,
	ButtonGroup,
	Col,
	Dropdown,
	Form,
	ListGroup,
	InputGroup,
	Row,
} from "react-bootstrap";

import classNames from "classnames";

function ChannelsList() {
	const { data: fetchedChannels, isLoading, error } = useGetChannelsQuery();
	const [removeChannel] = useRemoveChannelMutation();

	const dispatch = useDispatch();

	// const channels = fetchedChannels;
	const channelsState = useSelector(selectChannels);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const messages = useSelector(selectMessages);

	async function handleRemoveChannel(id) {
		try {
			const response = await removeChannel(id).unwrap();
			// console.log('response.id: ', response.id, typeof response.id)
			if (response.id) {
				dispatch(channelRemoved(response.id));
			}
			if (Number(response.id) === currentChannelId) {
				// возвращаем юзера в # general
				dispatch(setChannelById(1));
			}
		} catch (error) {
			throw new Error(`handleRemoveChannel() error:`, error);
		}
	}

	function MyButton({ children, id }) {
		const btnClass = classNames({
			btn: true,
			"rounded-0": true,
			"text-start": true,
			"text-truncate": true,
			"btn-secondary": currentChannelId === id,
		});

		return (
			<Button
				variant="none"
				className={btnClass}
				onClick={() => dispatch(setChannelById(id))}
			>
				{children}
			</Button>
		);
	}

	function DropdownToggleAndMenu({ id }) {
		const variant = classNames({
			none: currentChannelId !== id,
			secondary: currentChannelId === id,
		});

		return (
			<>
				<Dropdown.Toggle
					split
					variant={variant}
					id="dropdown-split-basic"
				/>

				<Dropdown.Menu>
					<Dropdown.Item>Переименовать</Dropdown.Item>
					<Dropdown.Item onClick={() => handleRemoveChannel(id)}>
						Удалить
					</Dropdown.Item>
				</Dropdown.Menu>
			</>
		);
	}

	function EditableButton({ children, id }) {
		return (
			<Dropdown as={ButtonGroup}>
				<MyButton id={id}>{children}</MyButton>
				<DropdownToggleAndMenu id={id} />
			</Dropdown>
		);
	}

	function channels() {
		const { ids, entities } = channelsState;

		// 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 ЗДЕСЬ добавляем кнопку с выпадающим списокм Rename и Remove
		const listedChannels = ids
			.map((id) => entities[id])
			.map(({ name, removable, id }) => (
				<ListGroup key={id}>
					{removable ? (
						<EditableButton id={Number(id)}>
							{"# " + name}
						</EditableButton>
					) : (
						<MyButton id={Number(id)}>{"# " + name}</MyButton>
					)}
				</ListGroup>
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
