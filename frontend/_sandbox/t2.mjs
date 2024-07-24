
// async function getChannels(token) {
//     const response = await axios.get("/api/v1/channels", {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     return response.data;
// }
// 	// useLayoutEffect(() => {
// 	// 	async function getChannels(token) {
// 	// 		const response = await axios.get("/api/v1/channels", {
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${token}`,
// 	// 			},
// 	// 		});
// 	// 		// console.log("channels: ", response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
// 	// 		return response.data;
// 	// 	}

// 	// 	async function getMessages(token) {
// 	// 		const response = await axios.get("/api/v1/messages", {
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${token}`,
// 	// 			},
// 	// 		});
// 	// 		// console.log("messages: ", response.data);
// 	// 		return response.data;
// 	// 	}

// 	// 	async function getChannelsList() {
// 	// 		const state = store.getState();
// 	// 		const token = state.auth.token;

// 	// 		const channels = await getChannels(token);
// 	// 		const messages = await getMessages(token);
// 	// 		console.log("channels: ", channels);

// 	// 		// channels.map((channel) =>
// 	// 		//     store.dispatch(channelAdded(channel))
// 	// 		// );
// 	// 		// messages.map((message) =>
// 	// 		//     store.dispatch(messageAdded(message))
// 	// 		// );

// 	// 		// const channels = state.channels;
// 	// 		const names = channels.ids.map((id) => channels.entities[id].name);

// 	// 		// console.log("App → channels: ", channels);
// 	// 		// console.log("App → names: ", names);
// 	// 		console.log("state: ", state);

// 	// 		return names;
// 	// 	}

// 	// 	channelsNamesList = getChannelsList();
// 	// 	// console.log('channelsNamesList: ', channelsNamesList);
// 	// }, []);


//     // useLayoutEffect(() => {

//     //     channelsNamesList = 'PLACEHOLDER';
//     // }, []);

//     const state = store.getState();
//     const token = state.auth.token;


//     const channels = await getChannels(token);
//     store.dispatch(channelAdded(channels));

//     console.log('state: ', state);
    
//     // const channelsNames = channels.map
//     console.log('channels: ', channels);