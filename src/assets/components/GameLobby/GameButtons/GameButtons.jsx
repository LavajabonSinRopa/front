import React from "react";

// Componente que maneja ambos botones
const GameButtons = ({
	playerId,
	ownerId,
	onStartGame,
	onCancelGame,
	onLeaveGame,
}) => {
	const isOwner = playerId === ownerId;
	//console.log("Hola! Soy GameButtons y estoy funcionando");

	return (
		<div>
			{/* Botón de "Iniciar Partida" solo visible para el owner */}
			{isOwner && <button onClick={onStartGame}>Iniciar Partida</button>}

			{/* Botón que cambia de "Cancelar Partida" a "Abandonar Partida" dependiendo de si es owner o jugador */}
			<button onClick={isOwner ? onCancelGame : onLeaveGame}>
				{isOwner ? "Cancelar Partida" : "Abandonar Partida"}
			</button>
		</div>
	);
};

export default GameButtons;
