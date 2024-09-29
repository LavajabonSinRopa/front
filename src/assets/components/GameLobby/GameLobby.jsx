import React from "react";
import GameInfo from "./GameInfo";
import PlayerList from "./PlayerList";
import GameButtons from "./GameButtons";

function GameLobby({ gameData, playerList }) {
	//console.log("Hola! Soy GameLobby y estoy funcionando");

	const onStartGame = () => {
		console.log("Iniciar juego");
	};

	const onCancelGame = () => {
		console.log("Cancelar juego");
	};

	const onLeaveGame = () => {
		console.log("Abandonar juego");
	};
	return (
		<div>
			<GameInfo
				gameName={gameData.gameName} //no imprime nada esto
				gameType="Pública"
			/>
			{/* Después se cambia gameType = "Pública" por gameType={gameData.gameType*/}
			<PlayerList
				playerList= {playerList}
				ownerId="123"
			/>
			<GameButtons
				playerId="123"
				ownerId="123"
				onStartGame={onStartGame}
				onCancelGame={onCancelGame}
				onLeaveGame={onLeaveGame}
			/>
		</div>
	);
}

export default GameLobby;
