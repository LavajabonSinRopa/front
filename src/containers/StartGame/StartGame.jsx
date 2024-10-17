import React, { useState, useRef, useEffect, useContext, useId } from "react";
import { useParams } from "react-router-dom";
import Board from "../Board/Board.jsx";
import LeaveGame from "../LeaveGame/LeaveGame.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import "./components/StartGameView.css";
import Card from "../Cards/Card.jsx";
import GameInfo from "../GameInfo/GameInfo.jsx";
import EndTurn from "../EndTurn/EndTurn.jsx";

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
  const [turnNumber, setTurnNumber] = useState(() => {
    const savedTurn = localStorage.getItem(`game_${game_id}_turn`);
    return savedTurn !== null ? parseInt(savedTurn, 10) : 1;
  });
  const [players, setPlayers] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [isYourTurn, setIsYourTurn] = useState(false); 


  // Verificar si es el turno del jugador actual
  const calculateIsYourTurn = (turn, players, userId) => {
    const turnIndex = (turn % players.length);
    const currentPlayerIndex = players.findIndex(player => player.unique_id === userId);
    return currentPlayerIndex === turnIndex;
  };

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
          setTurnNumber(result["turn"]);
          localStorage.setItem(`game_${game_id}_turn`, result["turn"]);
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
      if (message.type === "GameStarted") {
        const players = message.payload.players;
        setPlayers(players);
        const currentPlayer = players.filter(
          (player) => player.unique_id === userId
        )[0];
        setFigCards(currentPlayer.figure_cards.slice(0, 3));
        setMovCards(currentPlayer.movement_cards);
        setCurrentPlayerId(players[0]?.unique_id);
        // setTurnNumber(0);
        // localStorage.setItem(`game_${game_id}_turn`, 0);
      } else if (message.type === "TurnSkipped") {
        const newTurn = message.payload["turn"];
        setTurnNumber(newTurn); // Update turn state in StartGame
        setIsYourTurn(calculateIsYourTurn(newTurn, players, userId)); // Update if it's the player's turn
        localStorage.setItem(`game_${game_id}_turn`, newTurn);
      
        const playerIndex = newTurn % message.payload.players.length;
        const currentPlayer = message.payload.players[playerIndex];
      
        if (currentPlayer) {
          const currentPlayerId = currentPlayer.unique_id;
          setCurrentPlayerId(currentPlayerId);
        }
      } else if (message.type === "PlayerLeft") {
        setPlayers(prevPlayers => 
          prevPlayers.filter(player => player.unique_id !== message.payload.player_id)
        );
        setAllPlayersCards((prevPlayers) => {
          return prevPlayers.filter(
            (player) => player.unique_id !== message.payload.player_id
          );
        });
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

  return reconnectingWS || reconnectingAPI ? (
    <div>Intentando reconectar...</div>
  ) : (
    <div className="gameContainer">
      <GameInfo 
        turnNumber={turnNumber}
        players={players}
        currentPlayerId={currentPlayerId}
        userId={userId}
      />
      <Board className="boardContainer" board={board}/>
      <Card className="cardContainer" allPlayersCards={allPlayersCards} />
      <LeaveGame playerId={userId} gameId={game_id} />
      <EndTurn
        playerId={userId}
        gameId={game_id}
        currentTurn={turnNumber}
        isYourTurn={isYourTurn} //
      />
    </div>
  );
}
export default StartGame;