import React, { useEffect, useState } from "react";
import GameLobby from "../../components/GameLobby/GameLobby";
import { useWebSocket } from "../../contexts/WebsocketContext";

/* Extrae del JSON la info que necesitan los otros componentes, la guarda en 
gameData y playerList y luego se las pasa a los componentes */
function GameLobbyContainer() {
	console.log("Hola! Soy GameLobbyContainer y estoy funcionando");

	const socket = useWebSocket("/games");
	const [gameData, setGameData] = useState([]);
	const [playerList, setPlayerList] = useState([]);

	useEffect(() => {
		if (socket) {
			console.log("Hola! Soy GameLobbyContainer y estoy funcionando");

			const handleOpen = () => {
				socket.send(JSON.stringify({ type: "GET", endpoint: "/games" }));
			};

			const handleMessage = (event) => {
				const data = JSON.parse(event.data);
				console.log("Mensaje recibido:", event.data);
				const games = data.payload;

				setGameData(
					games.map((game) => ({
						gameName: game.name,
						gameId: game.id,
						gamePlayers: game.players,
						gameState: game.state,
					}))
				);
				setPlayerList(data.players);
			};

			socket.addEventListener("open", handleOpen);
			socket.addEventListener("message", handleMessage);

			return () => {
				socket.removeEventListener("open", handleOpen);
				socket.removeEventListener("message", handleMessage);
			};
		}
	}, [socket]);

	return (
		<>
			{gameData.length > 0 ? (
				gameData.map((gameData) => (
					<GameLobby
						gameData={gameData}
						playerList={playerList}
					/>
				))
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}

export default GameLobbyContainer;
