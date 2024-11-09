import React from "react";
// Componente que maneja ambos botones
const GameButtons = ({
  playerId,
  ownerId,
  gameId,
  playerList = [],
  onStartGame,
  onCancelGame,
  onLeaveGame,
}) => {
  const isOwner = playerId === ownerId;
  const playersNumber = playerList.length;
  return (
    <div>
      {isOwner && (
        <button
          onClick={onStartGame}
          disabled={playersNumber < 2 || 4 < playersNumber}
        >
          Iniciar Partida
        </button>
      )}

      <button onClick={isOwner ? onCancelGame : onLeaveGame}>
        {isOwner ? "Cancelar Partida" : "Abandonar Partida"}
      </button>
    </div>
  );
};

export default GameButtons;
