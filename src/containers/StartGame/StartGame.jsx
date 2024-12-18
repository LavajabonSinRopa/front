import React, { useState, useRef, useEffect } from "react";
import Board from "../Board/Board.jsx";
import LeaveGame from "../LeaveGame/LeaveGame.jsx";
import "./components/StartGameView.css";
import Cards from "../Cards/Cards.jsx";
import GameInfo from "../GameInfo/GameInfo.jsx";
import EndTurn from "../EndTurn/EndTurn.jsx";
import VictoryScreen from "../VictoryScreen/VictoryScreen.jsx";
import CancelMove from "../CancelMove/CancelMove.jsx";
import TurnTimer from "../TurnTimer/TurnTimer.jsx";
import ForbiddenColorDisplay from "../ForbiddenColorDisplay/ForbiddenColorDisplay.jsx";
import Chat from "../Chat/Chat.jsx";
import { MovCardProvider } from "../../contexts/MovCardContext";
import { MovementProvider } from "../../contexts/MovementContext";
import { FigCardProvider } from "../../contexts/FigCardContext.jsx";
import { BlockFigCardProvider } from "../../contexts/BlockFigCardContext.jsx";

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
  const [messages, setMessages] = useState([]);
  const [partialMovementsMade, setPartialMovementsMade] = useState(false);
  const [time, setTime] = useState(10);
  const [forbColor, setForbColor] = useState(null);

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
  //console.log(websocketUrl);
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
        setCurrentPlayerId(players[0]?.unique_id);
        setTurnNumber(message.payload.turn);
        setTime(message.payload.turn_timer);
        calculateCurrentPlayerId(0, message.payload.players);
        localStorage.setItem(`game_${game_id}_turn`, message.payload.turn);
        setForbColor(message.payload.forbidden_color);
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
        setTime(message.payload.turn_timer);
      } else if (message.type === "GameWon") {
        setIsGameOver(true);
        setWinner(message.payload.player_name);
      } else if (message.type === "MovSuccess") {
        setBoard(message.payload.board);
        setPlayers(message.payload.players);
        setTime(message.payload.turn_timer);
      } else if (message.type === "MoveUnMade") {
        setBoard(message.payload.board);
        setPlayers(message.payload.players);
        setTime(message.payload.turn_timer);
      } else if (message.type === "FigureMade") {
        setPlayers(message.payload.players);
        setTime(message.payload.turn_timer);
        setForbColor(message.payload.forbidden_color);
      } else if (message.type === "FigureBlocked") {
        setBoard(message.payload.board);
        setPlayers(message.payload.players);
        setForbColor(message.payload.forbidden_color);
      } else if (message.type === "ChatMessage") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: message.payload.player_id,
            type: message.payload.player_id === "1" ? "msgLog" : "message",
            msgInfo: `${message.payload.player_name} (${message.payload.time}): `,
            text: `${message.payload.message}`,
          },
        ]);
      } else {
        console.log("Tipo de mensaje desconocido:", message.type);
      }
    };
  };

  useEffect(() => {
    if (game_id && players.length > 0) {
      setIsYourTurn(calculateIsYourTurn(turnNumber, players, userId));
    }
  }, [turnNumber, players, userId, board]);

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

  useEffect(() => {
    if (players.length > 0) {
      const currentPlayer = players.find(
        (player) => player.unique_id === userId
      );
      if (currentPlayer && currentPlayer.movement_cards) {
        const hasBlockedCard = currentPlayer.movement_cards.some(
          (card) => card.state === "blocked"
        );
        setPartialMovementsMade(hasBlockedCard);
      }
    }
  }, [players, userId]);

  return reconnectingWS ? (
    <div>Intentando reconectar...</div>
  ) : (
    <MovementProvider>
      <MovCardProvider>
        <FigCardProvider>
          <BlockFigCardProvider>
            <div className="gameContainer">
              <div className="boardContainer">
                <Board
                  board={board}
                  isYourTurn={isYourTurn}
                  forbiddenColor={forbColor}
                />
              </div>
              {Array.isArray(players) && players.length > 0 && (
                <>
                  <div key={0} className="player">
                    <Cards
                      playerData={players.find(
                        (player) => player.unique_id === userId
                      )}
                      isYourTurn={isYourTurn}
                    />
                  </div>
                  {players
                    .filter((player) => player.unique_id !== userId)
                    .map((player, index) => (
                      <div key={index + 1} className={`opponent-${index + 1}`}>
                        {player && (
                          <Cards playerData={player} isYourTurn={isYourTurn} />
                        )}
                      </div>
                    ))}
                </>
              )}
              <div className="optionsButtonContainer">
                <LeaveGame playerId={userId} gameId={game_id} />
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
                  partialMovementsMade={partialMovementsMade}
                />
                <TurnTimer
                  initialTime={time}
                  playerId={userId}
                  gameId={game_id}
                  isYourTurn={isYourTurn}
                />
              </div>
              {isGameOver && (
                <VictoryScreen isGameOver={isGameOver} winner={winner} />
              )}
              <div className="gameInfo">
                <GameInfo
                  turnNumber={turnNumber}
                  players={players}
                  currentPlayerId={currentPlayerId}
                  userId={userId}
                />
                <ForbiddenColorDisplay color={forbColor} />
              </div>
              <div className="chatContainer">
                <Chat
                  messages={messages}
                  setMessages={setMessages}
                  socketRef={socketRef}
                />
              </div>
            </div>
          </BlockFigCardProvider>
        </FigCardProvider>
      </MovCardProvider>
    </MovementProvider>
  );
}
export default StartGame;
