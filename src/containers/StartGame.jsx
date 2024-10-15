import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "./Board/Board.jsx";
import LeaveGame from "./LeaveGame/LeaveGame.jsx";
import EndTurn from "./EndTurn/EndTurn.jsx";
import VictoryScreen from "./VictoryScreen/VictoryScreen.jsx";
import { UserIdContext } from "../contexts/UserIdContext.jsx";
import { useWebSocket } from "../contexts/WebsocketContext.jsx";

function StartGame() {
	const { game_id } = useParams(); 
	const { userId } = useContext(UserIdContext); 
	const { latestMessage, sendMessage } = useWebSocket(`/games/${game_id}/${userId}`); 
	const [players, setPlayers] = useState([]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [winner, setWinner] = useState(null);
	const [currentTurn, setCurrentTurn] = useState(0);

	useEffect(() => {
		setIsGameOver(false);
		setWinner(null);
		setPlayers([]);
		setCurrentTurn(0);
	}, [game_id]);

	useEffect(() => {
		if (latestMessage) {
			const { type, payload } = latestMessage;

			switch (type) {
				case 'SUCCESS':
					setPlayers(payload);
					break;

				case 'GameWon':
					setIsGameOver(true);
					setWinner(payload.player_name);
					break;

				case 'PlayerLeft':
					const { player_id } = payload;
					setPlayers((prevPlayers) =>
						prevPlayers.filter(player => player.id !== player_id)
					);
					break;

				default:
					console.warn("Unknown message type:", type);
					break;
			}
		}
	}, [latestMessage, game_id]);

	return (
		<div>
			<Board />
			{isGameOver && <VictoryScreen isGameOver={isGameOver} winner={winner} />}
			<EndTurn playerId={userId} gameId={game_id} players={players} currentTurn={currentTurn} />
			<LeaveGame playerId={userId} gameId={game_id} />
		</div>
	);
}
export default StartGame;
