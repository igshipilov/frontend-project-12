// import React, { useState, useEffect } from 'react';
// import { socket } from './socket';
// import { ConnectionState } from './components/ConnectionState';
// import { ConnectionManager } from './components/ConnectionManager';
// import { Events } from "./components/Events";
// import { MyForm } from './components/MyForm';

// export default function App() {
//   const [isConnected, setIsConnected] = useState(socket.connected);
//   const [fooEvents, setFooEvents] = useState([]);

//   useEffect(() => {
//     function onConnect() {
//       setIsConnected(true);
//     }

//     function onDisconnect() {
//       setIsConnected(false);
//     }

//     function onFooEvent(value) {
//       setFooEvents(previous => [...previous, value]);
//     }

//     socket.on('connect', onConnect);
//     socket.on('disconnect', onDisconnect);
//     socket.on('foo', onFooEvent);

//     return () => {
//       socket.off('connect', onConnect);
//       socket.off('disconnect', onDisconnect);
//       socket.off('foo', onFooEvent);
//     };
//   }, []);

//   return (
//     <div className="App">
//       <ConnectionState isConnected={ isConnected } />
//       <Events events={ fooEvents } />
//       <ConnectionManager />
//       <MyForm />
//     </div>
//   );
// }

import "bootstrap/dist/css/bootstrap.css";

import React, { useContext, useState, useEffect, useLayoutEffect } from "react";

import store from "./app/store.js";

import "./App.css";

import { BrowserRouter, Link, Navigate, Routes, Route } from "react-router-dom";

import { useSelector } from "react-redux";
import Auth from "./components/Auth.js";
import Chat from "./components/Chat.js";
import SignUp from "./components/SignUp.js";
import ErrorPage from "./components/ErrorPage.js";

import { socket } from "./socket.js";

function App() {
	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		socket.on("newChannel", (payload) => {
			console.log(payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
		});

		return () => {
			socket.off("newChannel");
		};
	}, []);

	function emitChannel() {
		if (socket.connected) {
			socket.emit(
				"newChannel",
				{ id: 6, name: "new channel", removable: true },
				(err) => {
					if (err) {
						console.error("Error sending message:", err);
					} else {
						console.log("Message sent successfully");
					}
				}
			);
		} else {
			console.error("Socket is not connected");
		}
	}

	return (
		<>
			<button type="button" onClick={emitChannel}>
				emit newChannel
			</button>

			<BrowserRouter>
				<Routes>
                    {/* UNCOMMENTME */}
					{/* <Route
						path="/login"
						element={user ? <Navigate to={"/"} /> : <Auth />}
					/>
					<Route
						path="/"
						element={user ? <Chat /> : <Navigate to={"/login"} />}
					/>
					<Route path="*" element={<Navigate to={"/"} />} /> */}
                    
                    {/* DELETME */}
                    <Route path="*" element={<Chat />} />
					
                    <Route path="/signup" element={<SignUp />} />
					<Route path="/404" element={<ErrorPage />} />
				</Routes>
			</BrowserRouter>
			<button type="button" onClick={() => console.log(store.getState())}>
				store.getState
			</button>
		</>
	);
}

export default App;
