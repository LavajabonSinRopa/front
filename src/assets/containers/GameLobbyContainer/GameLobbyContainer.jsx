import React, { useEffect, useState } from "react";
import GameLobby from "../../components/GameLobby/GameLobby";
import { useWebSocket } from "../../contexts/WebsocketContext";

function GameLobbyContainer({ gameId, playerId }) {
  const socket = useWebSocket("/games");
  const [gameData, setGameData] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    if (socket && gameId) {
      const handleOpen = () => {
        socket.send(
          JSON.stringify({ type: "GET", endpoint: `/games/${gameId}` })
        );
      };

      const handleMessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "CreatedGames") {
          const game = data.payload.find((game) => game.unique_id === gameId);
          console.log(game);
          if (game) {
            setGameData({
              gameName: game.name,
              gameId: game.unique_id,
              gameState: game.state,
              gameCreator: game.creator,
            });
            setPlayerList(game.players);
          }
          console.log(gameData);
          console.log(playerList);
        }
      };

      socket.addEventListener("open", handleOpen);
      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket, gameId]);

  return (
    <div>
      {gameData ? (
        <GameLobby
          gameData={gameData}
          playerList={playerList}
          playerId={playerId}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GameLobbyContainer;
