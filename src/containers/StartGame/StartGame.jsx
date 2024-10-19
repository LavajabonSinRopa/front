import React, { useState, useRef, useEffect, useContext } from "react";
import Board from "../Board/Board.jsx";
import LeaveGame from "../LeaveGame/LeaveGame.jsx";
import "./components/StartGameView.css";
import VictoryScreen from "../VictoryScreen/VictoryScreen.jsx";
import Cards from "../Cards/Cards.jsx";

function StartGame({ game_id, userId, websocketUrl }) {
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const socketRef = useRef(null);
  const [reconnectingWS, setReconnectingWS] = useState(false); // Estado para reconexion para WS
  const reconnectTimeoutRefWS = useRef(null);
  const isMounted = useRef(true); // Para verificar si el componente sigue montado
  const reconnectInterval = 150; // Intervalo de reconexion de 150 milisegundos

  // Funcion para conectar al WebSocket
  console.log(websocketUrl)
  const connectWebSocket = () => {
    if (!game_id || !userId) return;

    socketRef.current = new WebSocket(websocketUrl);
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
        setPlayers(message.payload.players);
        setBoard(message.payload.board);
      } else if (message.type === "PlayerLeft") {
        setPlayers((prevPlayers) => {
          return prevPlayers.filter(
            (player) => player.unique_id !== message.payload.player_id
          );
        });
      } else if (message.type === "TurnSkipped") {
        setBoard(message.payload.board);
        setPlayers(message.payload.players);
        setCurrentTurn(message.payload.turn);
      } else if (message.type === "GameWon") {
        setIsGameOver(true);
        setWinner(message.payload.player_name);
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

  return reconnectingWS ? (
    <div>Intentando reconectar...</div>
  ) : (
    <div className="gameContainer">
      <div className="boardContainer">
        <Board board={board} />
      </div>
      {Array.isArray(players) && players.length > 0 && (
        <>
          <div key={0} className="player">
            <Cards
              playerData={players.find((player) => player.unique_id === userId)}
            />
          </div>
          {players
            .filter((player) => player.unique_id !== userId)
            .map((player, index) => (
              <div key={index + 1} className={`opponent-${index + 1}`}>
                {player && <Cards playerData={player} />}
              </div>
            ))}
        </>
      )}
      <div className="leaveButtonContainer">
        <LeaveGame playerId={userId} gameId={game_id} />
      </div>
      {isGameOver && <VictoryScreen isGameOver={isGameOver} winner={winner} />}
    </div>
  );
}
export default StartGame;
