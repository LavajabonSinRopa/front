import React, {useState} from 'react';
import GameButtons from "../GameButtons/GameButtons"; 
import GameInfo from "../GameInfo";
import PlayerList from "../PlayerList";

function GameLobby({gameData, playerList, isOwner, onStartGame, onLeaveGame, onCancelGame}) {
  return (
    <div>
      <h1>Game Lobby</h1>
      <GameInfo gameName={gameData.game_name} gameType="Pública" />
      {/* Después se cambia gameType = "Pública" por gameType={gameData.game_type*/}
      <PlayerList players={playerList} ownerId={gameData.owner_id} />
      <GameButtons
        isOwner={isOwner}
        onStartGame={onStartGame}
        onCancelGame={onCancelGame}  
        onLeaveGame={onLeaveGame}
      />
    </div>
  );
}

export default GameLobby;
