import React, { useEffect, useState } from "react";
import GameLobby from "../../components/GameLobby/GameLobby";
import { useWebSocket } from "../../contexts/WebsocketContext";

/* Recibe un game_id y obtiene la info del juego correspondiente */
function GameLobbyContainer({ gameId, playerId }) {
	const socket = useWebSocket("/games");
	const [gameData, setGameData] = useState(null); // Datos del juego específico
	const [playerList, setPlayerList] = useState([]); // Lista de jugadores

	useEffect(() => {
		if (socket && gameId) {
			const handleOpen = () => {
				// Enviar solicitud para obtener el juego específico
				socket.send(
					JSON.stringify({ type: "GET", endpoint: `/games/${gameId}` })
				);
			};

			const handleMessage = (event) => {
				const data = JSON.parse(event.data);

				if (data.type === "CreatedGames") {
					const game = data.payload.find((game) => game.unique_id === gameId); // Buscar el juego con el ID especificado

					if (game) {
						// Actualizar la información del juego
						setGameData({
							gameName: game.name,
							gameId: game.unique_id,
							gameState: game.state,
							gameCreator: game.creator,
						});
						// Guardar la lista de jugadores
						setPlayerList(game.players);
					}
				}
			};

			socket.addEventListener("open", handleOpen);
			socket.addEventListener("message", handleMessage);

			return () => {
				socket.removeEventListener("open", handleOpen);
				socket.removeEventListener("message", handleMessage);
			};
		}
	}, [socket, gameId]);

	return (
		<div>
			{/* Renderizar GameLobby solo si hay datos del juego */}
			{gameData ? (
				<GameLobby
					gameData={gameData}
					playerList={playerList}
					playerId={playerId}
				/>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

export default GameLobbyContainer;
