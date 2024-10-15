import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Board from "./Board/Board.jsx";
import LeaveGame from "./LeaveGame/LeaveGame.jsx";
import { UserIdContext } from "../contexts/UserIdContext.jsx";


function StartGame() {
	const { game_id } = useParams(); 
    const { userId } = useContext(UserIdContext); 

	return (
		<div>
			<Board />
			<LeaveGame playerId={userId} gameId={game_id} />
		</div>
	);
}
export default StartGame;
