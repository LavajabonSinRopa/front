import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../contexts/WebsocketContext";
import GameLobby from "../../components/GameLobby/GameLobby";

const GameLobbyContainer = ({ gameId, playerId }) => {
  const [gameData, setGameData] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const socket = useWebSocket("/games");

  useEffect(() => {
    const fetchGameDetails = async () => {
      const data = await getGameDetails(gameId);
      setGameData(data);
      setPlayerList(data.players);
      setIsOwner(data.owner_id === playerId);
    };
    fetchGameDetails();
  }, [gameId, playerId]);

  const handleWebSocketMessage = (message) => {
    const { action, payload } = JSON.parse(message.data);
    if (action === 'UPDATE_PLAYERS') {
      setPlayerList(payload.players);
    }
  };

  useEffect(() => {
    if (socket) {
        socket.onmessage = handleWebSocketMessage;
      }
    }, [socket]);
    
      const handleOpen = () => {
        socket.send(JSON.stringify({ action: "GET", endpoint: "/games" }));
      };

      const handleMessage = (event) => {
        console.log("Response from server:", event.data);
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      const handleError = (error) => {
        console.error("WebSocket error:", error);
      };

      const handleClose = () => {
        console.log("WebSocket connection closed");
      };

      socket.addEventListener("open", handleOpen);
      socket.addEventListener("message", handleMessage);
      socket.addEventListener("error", handleError);
      socket.addEventListener("close", handleClose);

      return () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("message", handleMessage);
        socket.removeEventListener("error", handleError);
        socket.removeEventListener("close", handleClose);
      };
    }
  }, [socket, onMessage]);

  return (
    <div>
      <h1>WebSocket Example 2.0</h1>
    </div>
  );
};

export default GameLobbyContainer;
