import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../contexts/WebsocketContext";
import GameLobby from "../../components/GameLobby/GameLobby";
import GameInfo from "../../components/GameLobby/GameInfo/GameInfo";
import PlayerList from "../../components/GameLobby/PlayerList/PlayerList";
import PlayerItem from "../../components/GameLobby/PlayerList/PlayerItem";

/* Extrae del JSON la info que necesitan los otros componentes, la guarda en 
gameData y playerList y luego se las pasa a los componentes */
const GameLobbyContainer = () => {
  const socket = useWebSocket("/games");
  const [gameData, setGameData] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    if (socket) {
      const handleOpen = () => {
        socket.send(JSON.stringify({ action: "GET", endpoint: "/games" }));
      };
      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        setGameData({
          gameName: data.name,
          gameId: data.id,
          ownerId: data.owner, //cómo hago para saber quién es el owner?
        });
        setPlayerList(data.players);
      };
    }
  }, [socket, playerId]);

  return (
    <>
      <GameInfo gameName={gameData.gameName} gameType={gameData.gameType} />
      <GameLobby gameData={gameData} playerList={playerList} />
      <PlayerList players={playerList} ownerId={gameData.ownerId} />
    </>
  );
};

export default GameLobbyContainer;
