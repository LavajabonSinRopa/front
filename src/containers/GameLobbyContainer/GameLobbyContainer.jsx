import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameLobby from "./components/GameLobby";
import { UserIdContext } from "../../contexts/UserIdContext";

export const GameLobbyContainer = () => {
  const { game_id } = useParams();
  const { userId } = useContext(UserIdContext);
  const [gameData, setGameData] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [reconnectingAPI, setReconnectingAPI] = useState(false); // Estado para reconexion para la API
  const [reconnectingWS, setReconnectingWS] = useState(false); // Estado para reconexion para WS
  const socketRef = useRef(null);
  const reconnectTimeoutRefWS = useRef(null);
  const reconnectTimeoutRefAPI = useRef(null);
  const reconnectInterval = 150; // Intervalo de reconexion de 5 segundos
  const isMounted = useRef(true); // Para verificar si el componente sigue montado
  const navigate = useNavigate();

  // Fetch inicial de los datos del juego
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
          setReconnectingAPI(true); // Iniciar estado de reconexion
          // Reintentar despues del intervalo
          reconnectTimeoutRefAPI.current = setTimeout(() => {
            fetchGameData(); // Volver a intentar el fetch
          }, reconnectInterval);
          return;
        } else {
          const result = await response.json();
          const game = result;

          setGameData({
            gameName: game.name,
            gameId: game.unique_id,
            gameState: game.state,
            gameCreator: game.creator,
            gameType: game.type,
          });

          const { player_names, players } = game;
          const tuples = player_names.map((name, index) => [
            players[index],
            name,
          ]);
          setPlayerList(tuples);
          setReconnectingAPI(false); // Si el fetch es exitoso, cancelar el estado de reconexion
          if (reconnectTimeoutRefAPI.current)
            clearTimeout(reconnectTimeoutRefAPI.current);
        }
      } catch (error) {
        console.error("Error:", error);
        setReconnectingAPI(true); // Activar reconexion en caso de error
        reconnectTimeoutRefAPI.current = setTimeout(() => {
          fetchGameData(); // Reintentar el fetch después del intervalo
        }, reconnectInterval);
      }
    }
  };

  // useEffect para iniciar el fetch cuando el componente se monte
  useEffect(() => {
    fetchGameData();

    // Limpiar el timeout de reconexion cuando el componente se desmonte
    return () => {
      if (reconnectTimeoutRefAPI.current)
        clearTimeout(reconnectTimeoutRefAPI.current);
    };
  }, [game_id]);

  // Funcion para conectar al WebSocket
  const connectWebSocket = () => {
    if (!game_id || !userId) return;

    socketRef.current = new WebSocket(`/apiWS/games/${game_id}/${userId}`);
    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setReconnectingWS(false); // Conexion exitosa, cancelar el estado de reconexion
      if (reconnectTimeoutRefWS.current)
        clearTimeout(reconnectTimeoutRefWS.current);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setReconnectingWS(true); // Establecer el estado de reconexion
      // Intentar reconectar solo si el componente sigue montado
      if (isMounted.current) {
        reconnectTimeoutRefWS.current = setTimeout(() => {
          connectWebSocket();
        }, reconnectInterval);
      }
    };

    socketRef.current.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "PlayerJoined") {
        const { player_id, player_name } = message.payload;
        setPlayerList((prevPlayers) => [
          ...prevPlayers,
          [player_id, player_name],
        ]);
      } else if (message.type === "PlayerLeft") {
        // Actualizar lista cuando sale alguien
        const { player_id } = message.payload;
        setPlayerList((prevPlayers) =>
          prevPlayers.filter(([id]) => id !== player_id)
        );
      } else if (message.type === "GameStarted") {
        navigate(`/games/${game_id}/start`);
      } else if (message.type === "GameClosed") {
        navigate(`/`);
      }
    };
  };

  // Inicializacion y cierre del WebSocket
  useEffect(() => {
    isMounted.current = true; // Marcar el componente como montado
    // Solo conectar si estamos montados y tenemos valores validos
    if (game_id && userId) {
      // Solo conecta si no hay conexion activa
      if (
        !socketRef.current ||
        socketRef.current.readyState === WebSocket.CLOSED
      ) {
        connectWebSocket();
      }
    }
    // Limpiar el WebSocket y el timeout de reconexion cuando el componente se desmonte
    return () => {
      isMounted.current = false; // Marcar el componente como desmontado
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeoutRefWS.current)
        clearTimeout(reconnectTimeoutRefWS.current);
    };
  }, [game_id, userId, navigate]);

  return (
    <div>
      {gameData ? (
        reconnectingAPI || reconnectingWS ? (
          <p>Reconectando...</p>
        ) : (
          <GameLobby
            gameData={gameData}
            playerList={playerList}
            playerId={userId}
          />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameLobbyContainer;
