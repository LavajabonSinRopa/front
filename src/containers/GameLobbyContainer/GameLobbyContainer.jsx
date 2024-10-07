import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import GameLobby from "./components/GameLobby";
import { UserIdContext } from "../../contexts/UserIdContext";

export const GameLobbyContainer = () => {
  const { game_id } = useParams();
  const { userId, setUserId } = useContext(UserIdContext);
  const [gameData, setGameData] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    const fetchGameData = async () => {
      if (game_id) {
        try {
          const response = await fetch(`/api/games/${game_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.log(
              "Hubo un problema al crear la partida, intenta de nuevo."
            );
            return;
          }

          const result = await response.json();
          const game = result;

          setGameData({
            gameName: game.name,
            gameId: game.unique_id,
            gameState: game.state,
            gameCreator: game.creator,
          });
          setPlayerList(game.players);

          console.log("Partida creada:", result);
        } catch (error) {
          console.error("Error al crear la partida:", error);
        } finally {
          console.log("finaly");
        }
      }
    };

    fetchGameData();
  }, [game_id]);

  useEffect( () => {
    if (!game_id || !userId) return;

    const socket = new WebSocket(`/apiWS/games/${game_id}/${userId}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      if (message.type === "PlayerJoined") {
        const data = message.payload;
        setPlayerList(prevPlayers => [...prevPlayers, data]);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket de userId connection closed");
    };

    return () => {
      socket.close();
    };
  }, [game_id, userId]);

  return (
    <div>
      {gameData ? (
        <GameLobby
          gameData={gameData}
          playerList={playerList}
          playerId={gameData.creator}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameLobbyContainer;
