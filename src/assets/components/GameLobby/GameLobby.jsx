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
			<h1>{gameData.gameName}</h1>
			<GameInfo
				gameName="Lavajabon"
				gameType="Pública"
			/>
			{/* Después se cambia gameType = "Pública" por gameType={gameData.gameType*/}
			<PlayerList
				players={["messi", "ronaldo", "neymar", "mbappe"]}
				ownerId="123"
			/>
			<GameButtons
				playerId="3e4"
				ownerId="123"
				onStartGame={onStartGame}
				onCancelGame={onCancelGame}
				onLeaveGame={onLeaveGame}
			/>
		</div>
	);
}

export default GameLobby;
