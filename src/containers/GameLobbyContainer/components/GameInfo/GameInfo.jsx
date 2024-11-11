import React from "react";
import "./GameInfo.css";

function GameInfo({ gameName, gameType }) {
  return (
    <div className="lobbyGameInfoContainer">
      <p className="lobbyGameInfoData">
        <strong>Nombre de la partida:</strong> {gameName}
      </p>
      <p className="lobbyGameInfoData">
        <strong>Tipo de la partida:</strong> {gameType}
      </p>
    </div>
  );
}

export default GameInfo;
