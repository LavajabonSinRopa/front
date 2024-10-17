import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Board from "../Board/Board.jsx";
import LeaveGame from "../LeaveGame/LeaveGame.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import "./components/StartGameView.css";
import VictoryScreen from "./VictoryScreen/VictoryScreen.jsx";
import Card from "../Cards/Card.jsx";

function StartGame() {
  const { game_id } = useParams();
  const { userId } = useContext(UserIdContext);
  const [reconnectingWS, setReconnectingWS] = useState(false); // Estado para reconexion para WS
  const [reconnectingAPI, setReconnectingAPI] = useState(false); // Estado para reconexion para la API
  const [allPlayersCards, setAllPlayersCards] = useState([]);
  const [board, setBoard] = useState("");
  const socketRef = useRef(null);
  const reconnectTimeoutRefWS = useRef(null);
  const reconnectTimeoutRefAPI = useRef(null);
  const isMounted = useRef(true); // Para verificar si el componente sigue montado
  const reconnectInterval = 150; // Intervalo de reconexion de 150 milisegundos
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);

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
            "Hubo un problema al crear la partida, intentando de nuevo..."
          );
          setReconnectingAPI(true); // Iniciar estado de reconexion
          // Reintentar despues del intervalo
          reconnectTimeoutRefAPI.current = setTimeout(() => {
            fetchGameData(); // Volver a intentar el fetch
          }, reconnectInterval);
          return;
        } else {
          const result = await response.json();
          console.log(result);
          setBoard(result.board);
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
      } finally {
        console.log("finally");
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
      if (message.type === "GameStarted") {
        const players = message.payload.players;
        setAllPlayersCards(players);
      } else if (message.type === "PlayerLeft") {
        setAllPlayersCards((prevPlayers) => {
          return prevPlayers.filter(
            (player) => player.unique_id !== message.payload.player_id
          );
        });
      } else if (message.type === "TurnSkipped") {
        setBoard(payload.board);
        setAllPlayersCards((prevPlayers) => {
          return prevPlayers.filter(
            (player) => player.unique_id !== message.payload.player_id
          );
        });
        setCurrentTurn(payload.turn);
      } else if (message.type === "GameWon") {
        setIsGameOver(true);
        setWinner(payload.player_name);
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
  }, [game_id, userId]);

  return reconnectingWS || reconnectingAPI ? (
    <div>Intentando reconectar...</div>
  ) : (
    <div className="gameContainer">
      <Board className="boardContainer" board={board} />
      <Card className="cardContainer" allPlayersCards={allPlayersCards} />
      <LeaveGame playerId={userId} gameId={game_id} />
      {isGameOver && <VictoryScreen isGameOver={isGameOver} winner={winner} />}
    </div>
  );
}
export default StartGame;
