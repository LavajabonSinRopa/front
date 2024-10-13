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
	console.log("PlayerId: ", playerId);
	console.log("OwnerId: ", ownerId);
	const playersNumber = playerList.length;
	return (
		<div>
			{/* Botón de "Iniciar Partida" solo visible para el owner */}
			{isOwner && (
				<button
					onClick={onStartGame}
					disabled={playersNumber !== 4}
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
