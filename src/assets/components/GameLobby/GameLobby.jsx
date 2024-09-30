import React from "react";
import GameInfo from "./GameInfo/GameInfo";
import PlayerList from "./PlayerList/PlayerList";
import GameButtons from "./GameButtons/GameButtons";

function GameLobby({ gameData, playerList, playerId }) {
	const { gameName, gameId, gameState, gameCreator } = gameData; // Destructure gameData

	const onStartGame = () => {
		console.log(`Iniciar juego para ${gameId}`);
	};

	const onCancelGame = () => {
		console.log(`Cancelar juego para ${gameId}`);
	};

	const onLeaveGame = () => {
		console.log(`Abandonar juego para ${gameId}`);
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
