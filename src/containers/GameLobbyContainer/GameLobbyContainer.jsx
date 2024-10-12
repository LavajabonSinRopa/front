import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import GameLobby from "./components/GameLobby";
import { UserIdContext } from "../../contexts/UserIdContext";

export const GameLobbyContainer = () => {
  //obtiene game_id de la url
  const { game_id } = useParams();
  //contexto global que tiene la userId de la ultima partida a la que entro el usuario
  const { userId, setUserId } = useContext(UserIdContext);
  const [gameData, setGameData] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    //La logica que hace fetch al principio
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

          const { player_names, players } = game;
          const tuples = player_names.map((name, index) => [players[index], name]);
          setPlayerList(tuples);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          console.log("finaly");
        }
      }
    };

    fetchGameData();
  }, [game_id]);



  // Inicializacion y Cierre del WebSocket
  useEffect(() => {
    if (!game_id || !userId) {
      return;
    }

    socketRef.current = new WebSocket(`/apiWS/games/${game_id}/${userId}`);
    socketRef.current.onopen = () => console.log("ws opened");
    socketRef.current.onclose = () => console.log("ws closed");
    socketRef.current.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
    const wsCurrent = socketRef.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  //Aca se maneja la comunicacion por websocket
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "PlayerJoined") {
        const { player_id, player_name } = message.payload;
        setPlayerList(prevPlayers => [...prevPlayers, [player_id, player_name]]);
      }
    };
  }, [game_id, userId]);

  return (
    <div>
      {gameData ? (
        <GameLobby
          gameData={gameData}
          playerList={playerList}
          playerId={userId}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameLobbyContainer;
