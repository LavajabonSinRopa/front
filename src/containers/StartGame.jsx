import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Board from "./Board/Board.jsx";
import LeaveGame from "./LeaveGame/LeaveGame.jsx";
import VictoryScreen from "./VictoryScreen/VictoryScreen.jsx";
import { UserIdContext } from "../contexts/UserIdContext.jsx";

function StartGame() {
    const { game_id } = useParams(); 
    const { userId } = useContext(UserIdContext); 
    const [board, setBoard] = useState([]);
    const [players, setPlayers] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(0);
    const socketRef = useRef(null);

    useEffect(() => {
        setIsGameOver(false);
        setWinner(null);
        setPlayers([]);
        setCurrentTurn(0);
        setBoard([]);
    }, [game_id]);

    useEffect(() => {
        if (!game_id || !userId) return;

        socketRef.current = new WebSocket(`/apiWS/games/${game_id}/${userId}`);

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            if (message) {
                const { type, payload } = message;
                switch (type) {
                    case 'GameStarted':
                        setBoard(payload.board);
                        setPlayers(payload.players);
                        setCurrentTurn(payload.turn);
					break;
                    
					case 'TurnSkipped':
                        setBoard(payload.board);
                        setPlayers(payload.players);
                        setCurrentTurn(payload.turn);
					break;
                    
					case 'GameWon':
                        setIsGameOver(true);
                        setWinner(payload.player_name);
					break;
                    
					case 'PlayerLeft':
                        const { player_id } = payload;
                        setPlayers((prevPlayers) =>
                            prevPlayers.filter(player => player.unique_id !== player_id)
                        );
					break;
                    
					default:
                        console.warn("Unknown message type:", type);
                        break;
                }
            }
        };
        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [game_id, userId]);

    return (
        <div>
            <Board board={board} />
            {isGameOver && <VictoryScreen isGameOver={isGameOver} winner={winner} />}
            <LeaveGame playerId={userId} gameId={game_id} />
        </div>
    );
}
export default StartGame;
