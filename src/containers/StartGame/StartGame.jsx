import React, { useState, useRef, useEffect } from "react";
import Board from "../Board/Board.jsx";
import LeaveGame from "../LeaveGame/LeaveGame.jsx";
import "./components/StartGameView.css";
import Cards from "../Cards/Cards.jsx";
import GameInfo from "../GameInfo/GameInfo.jsx";
import EndTurn from "../EndTurn/EndTurn.jsx";
import VictoryScreen from "../VictoryScreen/VictoryScreen.jsx";
import CancelMove from "../CancelMove/CancelMove.jsx";
import { MovCardProvider } from "../../contexts/MovCardContext";
import { MovementProvider } from "../../contexts/MovementContext";

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
  const [turnNumber, setTurnNumber] = useState(() => {
    const savedTurn = localStorage.getItem(`game_${game_id}_turn`);
    return savedTurn !== null ? parseInt(savedTurn, 10) : 1;
  });
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [isYourTurn, setIsYourTurn] = useState(false);

  const [movesDone, setMovesDone] = useState(0);

  // Verificar si es el turno del jugador actual
  const calculateIsYourTurn = (turn, players, userId) => {
    const turnIndex = turn % players.length;
    const currentPlayerIndex = players.findIndex(
      (player) => player.unique_id === userId
    );
    return currentPlayerIndex === turnIndex;
  };

  const calculateCurrentPlayerId = (newTurn, players) => {
    const playerIndex = newTurn % players.length;
    const currentPlayer = players[playerIndex];

    if (currentPlayer) {
      const currentPlayerId = currentPlayer.unique_id;
      setCurrentPlayerId(currentPlayerId);
    }
  };

  // Funcion para conectar al WebSocket
  console.log(websocketUrl);
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
      console.log(message)
      if (message.type === "GameStarted") {
        setPlayers(message.payload.players);
        setBoard(message.payload.board);
        setCurrentPlayerId(players[0]?.unique_id);
        calculateCurrentPlayerId(0, players);
        setTurnNumber(message.payload.turn);
        calculateCurrentPlayerId(turnNumber, message.payload.players);
        localStorage.setItem(`game_${game_id}_turn`, message.payload.turn);
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
        const newTurn = message.payload["turn"];
        setTurnNumber(newTurn); // Update turn state in StartGame
        setIsYourTurn(calculateIsYourTurn(newTurn, players, userId)); // Update if it's the player's turn
        localStorage.setItem(`game_${game_id}_turn`, newTurn);
        calculateCurrentPlayerId(newTurn, message.payload.players);
      } else if (message.type === "GameWon") {
        setIsGameOver(true);
        setWinner(message.payload.player_name);
      } else if (message.type === "MovSuccess") {
        setBoard(message.payload.board);
        setPlayers(message.payload.players);
      } else if (message.type === "MoveUnMade") {
        setBoard(message.payload.board);
        setPlayers(message.payload.players);
      }
    };
  };

  useEffect(() => {
    if (game_id && players.length > 0) {
      setIsYourTurn(calculateIsYourTurn(turnNumber, players, userId));
    }
  }, [turnNumber, players, userId]);

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
    <MovementProvider>
      <MovCardProvider>
        <div className="gameContainer">
          <div className="boardContainer">
            <Board board={board} isYourTurn={isYourTurn}/>
          </div>
          {Array.isArray(players) && players.length > 0 && (
            <>
              <div key={0} className="player">
                <Cards
                  playerData={players.find(
                    (player) => player.unique_id === userId
                  )} isYourTurn={isYourTurn}
                />
              </div>
              {players
                .filter((player) => player.unique_id !== userId)
                .map((player, index) => (
                  <div key={index + 1} className={`opponent-${index + 1}`}>
                    {player && <Cards playerData={player} isYourTurn={isYourTurn}/>}
                  </div>
                ))}
            </>
          )}
          <div className="leaveButtonContainer">
            <LeaveGame playerId={userId} gameId={game_id} />
          </div>
          {isGameOver && (
            <VictoryScreen isGameOver={isGameOver} winner={winner} />
          )}
          <GameInfo
            turnNumber={turnNumber}
            players={players}
            currentPlayerId={currentPlayerId}
            userId={userId}
          />
          <EndTurn
            playerId={userId}
            gameId={game_id}
            currentTurn={turnNumber}
            isYourTurn={isYourTurn}
          />
          <CancelMove
            playerId={userId}
            gameId={game_id}
            isYourTurn={isYourTurn}
          />
        </div>
      </MovCardProvider>
    </MovementProvider>
  );
}
export default StartGame;
