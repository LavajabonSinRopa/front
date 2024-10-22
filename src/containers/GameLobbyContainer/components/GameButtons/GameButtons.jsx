import React from "react";
// Componente que maneja ambos botones
const GameButtons = ({
	playerId,
	ownerId,
	gameId,
	playerList,
	onStartGame,
	onLeaveGame,
}) => {
	const isOwner = playerId === ownerId;
	const playersNumber = playerList.length;
	return (
		<div>
			{/* Botón de "Iniciar Partida" solo visible para el owner */}
			{isOwner && (
				<button
					onClick={onStartGame}
					disabled={playersNumber < 2 || 4 < playersNumber}
				>
					Iniciar Partida
				</button>
			)}

			{/* Botón que cambia de "Cancelar Partida" a "Abandonar Partida" 
			dependiendo de si es owner o jugador 
			<button onClick={isOwner ? onCancelGame : onLeaveGame}>
				{isOwner ? "Cancelar Partida" : "Abandonar Partida"}
			</button>*/}
			{!isOwner && <button onClick={onLeaveGame}>Abandonar Partida</button>}
		</div>
	);
};

export default GameButtons;
