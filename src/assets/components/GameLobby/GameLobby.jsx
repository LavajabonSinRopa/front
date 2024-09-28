import React, {useState} from 'react';
import GameInfo from "./GameInfo";
import PlayerList from "./PlayerList";
import GameButtons from './GameButtons';

function GameLobby({gameData, playerList}) {
  if (!gameData) {
    return <div>Loading...</div>;
  }
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
      <h1>Game Lobby</h1>
      <GameInfo gameName={gameData.gameName} gameType="Pública" />
      {/* Después se cambia gameType = "Pública" por gameType={gameData.gameType*/}
      <PlayerList players={playerList} ownerId={gameData.ownerId} />
      <GameButtons
        ownerId={gameData.ownerId}
        onStartGame={onStartGame}
        onCancelGame={onCancelGame}  
        onLeaveGame={onLeaveGame}
      />
    </div>
  );
}

export default GameLobby;
