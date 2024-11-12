import React from "react";
import "./GameButtons.css";
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
    <div className="lobbyGameButtonsContainer">
      {isOwner && (
        <button
          className="lobbyStartGameButton"
          onClick={onStartGame}
          disabled={playersNumber < 2 || 4 < playersNumber}
        >
          Iniciar Partida
        </button>
      )}

      <button
        className="lobbyLeaveGameButton"
        onClick={isOwner ? onCancelGame : onLeaveGame}
      >
        {isOwner ? "Cancelar Partida" : "Abandonar Partida"}
      </button>
    </div>
  );
};

export default GameButtons;
