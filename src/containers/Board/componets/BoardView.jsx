import React, { useContext } from "react";
import PiecesView from "./PiecesView";
import "./BoardView.css";
import { MovementContext } from "../../../contexts/MovementContext";
import { MovCardContext } from "../../../contexts/MovCardContext";

const BoardView = ({ board, handleMovSelection, movError }) => {
  const {
    firstPieceXaxis,
    firstPieceYaxis,
    secondPieceXaxis,
    secondPieceYaxis,
  } = useContext(MovementContext);
  const { movCardType } = useContext(MovCardContext);

  function isMoveableSlot(xAxis, yAxis) {
    let isMoveable = false;
    let dx = Math.abs(xAxis - firstPieceXaxis);
    let dy = Math.abs(yAxis - firstPieceYaxis);
    if (firstPieceXaxis !== null && firstPieceYaxis !== null) {
      if (movCardType === "0") {
        isMoveable = dx === 2 && dy === 2;
      } else if (movCardType === "1") {
        isMoveable = (dx === 2 && dy === 0) || (dx === 0 && dy === 2);
      } else if (movCardType === "2") {
        isMoveable = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      } else if (movCardType === "3") {
        isMoveable = dx === 1 && dy === 1;
      } else if (movCardType === "4") {
        dx = xAxis - firstPieceXaxis;
        dy = yAxis - firstPieceYaxis;
        isMoveable =
          (dx === -2 && dy === 1) ||
          (dx === 2 && dy === -1) ||
          (dx === 1 && dy === 2) ||
          (dx === -1 && dy === -2);
      } else if (movCardType === "5") {
        dx = xAxis - firstPieceXaxis;
        dy = yAxis - firstPieceYaxis;
        isMoveable =
          (dx === 2 && dy === 1) ||
          (dx === -2 && dy === -1) ||
          (dx === -1 && dy === 2) ||
          (dx === 1 && dy === -2);
      } else if (movCardType === "6") {
        isMoveable = (dx === 4 && dy === 0) || (dx === 0 && dy === 4);
      }
    }
    return isMoveable;
  }

  if (board.length !== 6 || board.some((row) => row.length !== 6)) {
    return <h1>ERROR: FORMATO DE TABLERO INCORRECTO</h1>;
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((char, colIndex) => (
            <div
              key={colIndex}
              className="piece"
              onClick={() => handleMovSelection(rowIndex, colIndex)}
            >
              <PiecesView
                color={char}
                isSelected={
                  firstPieceXaxis === colIndex && firstPieceYaxis === rowIndex
                }
                moveableSlot={isMoveableSlot(colIndex, rowIndex)}
                movError={
                  movError &&
                  ((firstPieceXaxis === colIndex &&
                    firstPieceYaxis === rowIndex) ||
                    (secondPieceXaxis === colIndex &&
                      secondPieceYaxis === rowIndex))
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BoardView;
