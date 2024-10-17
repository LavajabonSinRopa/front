import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Board from "./Board/Board.jsx";
import LeaveGame from "./LeaveGame/LeaveGame.jsx";
import { UserIdContext } from "../contexts/UserIdContext.jsx";
import PartialMovement from "./PartialMovements/PartialMovement.jsx";
import "./StartGame.css";

function StartGame() {
  const { game_id } = useParams();
  const { userId } = useContext(UserIdContext);

  return (
    <div className="game-container">
      <div className="board-container">
        <Board />
        <LeaveGame playerId={userId} gameId={game_id} />
      </div>
      <PartialMovement />
    </div>
  );
}
export default StartGame;
