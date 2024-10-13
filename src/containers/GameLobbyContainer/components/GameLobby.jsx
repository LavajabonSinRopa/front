import React, {useCallback} from "react";
import GameInfo from "./GameInfo/GameInfo";
import PlayerList from "./PlayerList/PlayerList";
import GameButtons from "./GameButtons/GameButtons";
import { useNavigate } from "react-router-dom";

function GameLobby({ gameData, playerList, playerId }) {
	const { gameName, gameId, gameState, gameCreator } = gameData; // Destructure gameData
	const navigate = useNavigate();

	const onStartGame = () => {
		console.log(`Iniciar juego para ${gameId}`);
	};

	const onCancelGame = () => {
		console.log(`Cancelar juego para ${gameId}`);
	};

	const onLeaveGame = async () =>{
		const data = {
			player_id: playerId,
		};

		try {
			const response = await fetch(`/api/games/${gameId}/leave`, {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify(data),
			});
	  
			if (response.ok) {
			  console.log(`Jugador ${playerId} ha abandonado el juego ${gameId}`);
			  navigate("/");
			} else {
			  console.error("Error al intentar abandonar el juego");
			}
		} catch (error) {
			console.error("Error en la solicitud:", error);
		}	
	};

	return (
		<div>
			<GameInfo
				gameName={gameName}
				gameType="Pública"
			/>
			<PlayerList
				playerList={playerList}
				ownerId={gameCreator}
			/>
			<GameButtons
				playerId={playerId}
				ownerId={gameCreator}
				onStartGame={onStartGame}
				onCancelGame={onCancelGame}
				onLeaveGame={onLeaveGame}
			/>
		</div>
	);
}

export default GameLobby;
