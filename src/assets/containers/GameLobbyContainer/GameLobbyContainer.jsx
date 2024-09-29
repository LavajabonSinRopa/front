import React, { useEffect, useState } from "react";
import GameLobby from "../../components/GameLobby/GameLobby";
import { useWebSocket } from "../../contexts/WebsocketContext";
import PlayerList from "../../components/GameLobby/PlayerList/PlayerList";

/* Extrae del JSON la info que necesitan los otros componentes, la guarda en 
gameData y playerList y luego se las pasa a los componentes */
function GameLobbyContainer() {
	const socket = useWebSocket("/games");
	const [gameData, setGameData] = useState([]);
	const [playerList, setPlayerList] = useState([]);

	useEffect(() => {
		if (socket) {
			const handleOpen = () => {
				socket.send(JSON.stringify({ type: "GET", endpoint: "/games" }));
			};

			const handleMessage = (event) => {
				const data = JSON.parse(event.data);
				//console.log("Mensaje recibido:", event.data);
				// 	const games = data.payload;

				// 	setGameData(
				// 		games.map((game) => ({
				// 			gameName: game.name,
				// 			gameId: game.id,
				// 			gamePlayers: game.players,
				// 			gameState: game.state,
				// 		}))
				// 	);
				// 	setPlayerList(data.players);
				// };

				//creacion de gpt esto de abajo
				if (data.type === "CreatedGames") {
					const game = data.payload; // Accede directamente al juego en payload

					// Guarda la información del juego
					setGameData({
						gameName: game.name,
						gameId: game.unique_id,
						gameState: game.state,
						gameCreator: game.creator,
						//playerCount: game.players.length, // Cantidad de jugadores
					});

					// Guarda la lista de jugadores
					setPlayerList(game.players);
				}
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
			{/* 
			dudas con esto que está comentado, me renderiza todas las partidas de la comarca :/
			{gameData.length > 0 ? (
				gameData.map((gameData) => ( */}
			<GameLobby
				gameData={gameData}
				playerList={playerList}
			/>
			{/*
			 ))
			) : (
				<p>Loading...</p>
			)} */}
		</>
	);
}

export default GameLobbyContainer;
