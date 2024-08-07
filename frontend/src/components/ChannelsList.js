import "bootstrap/dist/css/bootstrap.css";

import React, { useState, useEffect } from "react";
import {
	useGetChannelsQuery,
	useRenameChannelMutation,
	useRemoveChannelMutation,
} from "../api/api.js";

import { useDispatch, useSelector } from "react-redux";
import { setChannelById } from "../features/channels/currentChannelIdSlice.js";

import {
	channelsAdded,
	channelRenamed,
	channelRemoved,
	selectChannels,
} from "../features/channels/channelsSlice.js";

import {
	selectMessages,
	messageRemoved,
	messagesRemoved,
} from "../features/messages/messagesSlice.js";

import { selectCurrentChannelId } from "../features/channels/currentChannelIdSlice.js";

import {
	Button,
	ButtonGroup,
	Col,
	Dropdown,
	Form,
	ListGroup,
	Modal,
	InputGroup,
	Row,
} from "react-bootstrap";

import { Formik } from "formik";

import * as yup from "yup";

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

			if (response.id) {
				const messagesIdsToRemove = messages.ids.filter(
					(messageId) => id === messages.entities[messageId].channelId
				);
				dispatch(channelRemoved(response.id));
				dispatch(messagesRemoved(messagesIdsToRemove));
			}
			if (Number(response.id) === currentChannelId) {
				dispatch(setChannelById(1)); // возвращаем юзера в # general
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

	function ModalConfirmRemoveChannel(props) {
		const { onHide, id } = props;
		return (
			<Modal
				{...props}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Удалить канал
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Row>Уверены?</Row>
					<Button className="btn-secondary" onClick={onHide}>
						Отменить
					</Button>
					<Button
						className="btn-danger"
						onClick={() => handleRemoveChannel(id)}
					>
						Удалить
					</Button>
				</Modal.Body>
			</Modal>
		);
	}

	function FormRenameChannel({ hideModal, id }) {
		const [
			renameChannel,
			{ error: renameChannelError, isLoading: isRenameChannelLoading },
		] = useRenameChannelMutation();

		const dispatch = useDispatch();

		const {
			data: channels,
			isLoading: isChannelsLoading,
			error: ChannelLoadingError,
		} = useGetChannelsQuery();

		const channelsNames = channels.map(({ name }) => name);

		async function submitChannel(values) {
			try {
				console.log("values: ", values);
				const response = await renameChannel({
					id: id,
					name: values.name,
				}).unwrap();

				dispatch(channelRenamed({ id, name: values.name }));

				hideModal();

				console.log("renameChannel → response: ", response);
			} catch (error) {
				throw new Error("Failed to rename channel: ", error);
			}
		}

		const validationSchema = yup.object({
			name: yup
				.string()
				.required("Надо ввести хоть какое-нибудь название :с")
				.min(3, "От 3 до 20 символов")
				.max(20, "От 3 до 20 символов")
				.notOneOf(
					channelsNames,
					"Такое название уже существует, надо уникальное >_<"
				),
		});

		return (
			<Formik
				validationSchema={validationSchema}
				validateOnBlur={false}
				validateOnChange={false}
				onSubmit={(values, { resetForm }) => {
					submitChannel(values);
					resetForm();
				}}
				initialValues={{
					name: "",
				}}
			>
				{({ handleSubmit, handleChange, values, errors }) => (
					<>
						<Form noValidate onSubmit={handleSubmit}>
							<Row className="mb-3">
								<Form.Group
									as={Col}
									md="4"
									controlId="FormikRenameChannel"
								>
									<InputGroup hasValidation>
										<Form.Control
											type="text"
											autoFocus
											aria-describedby="inputGroupPrepend"
											name="name"
											value={values.name}
											onChange={handleChange}
											isInvalid={!!errors.name}
										/>
										<Form.Control.Feedback
											type="invalid"
											tooltip
										>
											{errors.name}
										</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>
							</Row>

							<Button
								className="btn-secondary"
								onClick={() => hideModal()}
							>
								Отменить
							</Button>

							<Button
								type="submit"
								disabled={isRenameChannelLoading}
							>
								{isRenameChannelLoading
									? "Отправляем"
									: "Отправить"}
							</Button>
						</Form>
					</>
				)}
			</Formik>
		);
	}

	function ModalRenameChannel(props) {
		// console.log("props: ", props);
		return (
			<Modal
				{...props}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Переименовать канал
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FormRenameChannel hideModal={props.onHide} id={props.id} />
				</Modal.Body>
			</Modal>
		);
	}

	function DropdownToggleAndMenu({ id }) {
		const [
			modalConfirmRemoveChannelShow,
			setModalConfirmRemoveChannelShow,
		] = useState(false);

		const [modalRenameChannelShow, setModalRenameChannelShow] =
			useState(false);

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
					<Dropdown.Item
						onClick={() => setModalRenameChannelShow(true)}
					>
						Переименовать
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => setModalConfirmRemoveChannelShow(true)}
					>
						Удалить
					</Dropdown.Item>
				</Dropdown.Menu>

				<ModalConfirmRemoveChannel
					show={modalConfirmRemoveChannelShow}
					onHide={() => setModalConfirmRemoveChannelShow(false)}
					id={id}
				/>
				<ModalRenameChannel
					show={modalRenameChannelShow}
					onHide={() => setModalRenameChannelShow(false)}
					id={id}
				/>
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
