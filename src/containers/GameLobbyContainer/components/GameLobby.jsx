import React, { useCallback } from "react";
import GameInfo from "./GameInfo/GameInfo";
import PlayerList from "./PlayerList/PlayerList";
import GameButtons from "./GameButtons/GameButtons";
import { useNavigate } from "react-router-dom";

function GameLobby({ gameData, playerList, playerId }) {
  const { gameName, gameId, gameState, gameCreator, gameType } = gameData; // Destructure gameData
  const navigate = useNavigate();

  const onStartGame = async () => {
    const data = {
      player_id: playerId,
    };

    try {
      const response = await fetch(`/api/games/${gameId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate(`/games/${gameId}/start`);
      } else {
        console.error("Error al intentar iniciar la partida");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const onCancelGame = async () => {
    const data = {
      player_id: playerId,
    };

    try {
      const response = await fetch(`/api/games/${gameId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error al intentar cancelar la partida");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const onLeaveGame = async () => {
    const data = {
      player_id: playerId,
    };

    try {
      const response = await fetch(`/api/games/${gameId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error al intentar abandonar el lobby");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div>
      <GameInfo
        gameName={gameName}
        gameType={gameType == "public" ? "Pública" : "Privada"}
      />
      <PlayerList playerList={playerList} ownerId={gameCreator} />
      <GameButtons
        playerId={playerId}
        ownerId={gameCreator}
        gameId={gameId}
        playerList={playerList}
        onStartGame={onStartGame}
        onCancelGame={onCancelGame}
        onLeaveGame={onLeaveGame}
      />
    </div>
  );
}

export default GameLobby;
